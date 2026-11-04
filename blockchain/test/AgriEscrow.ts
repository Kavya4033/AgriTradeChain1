import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("AgriEscrow", function () {
  const orderId = ethers.id("agritrade-order-001");
  const payment = ethers.parseEther("0.01");

  it("records the buyer's payment and emits OrderFunded", async function () {
    const [owner, buyer, farmer] = await ethers.getSigners();
    const escrow = await ethers.deployContract("AgriEscrow");

    await expect(
      escrow.connect(buyer).createOrder(orderId, farmer.address, { value: payment }),
    )
      .to.emit(escrow, "OrderFunded")
      .withArgs(orderId, buyer.address, farmer.address, payment);

    const order = await escrow.orders(orderId);
    expect(order.buyer).to.equal(buyer.address);
    expect(order.farmer).to.equal(farmer.address);
    expect(order.amount).to.equal(payment);
    expect(order.status).to.equal(1n);
    expect(await ethers.provider.getBalance(await escrow.getAddress())).to.equal(payment);
    expect(await escrow.owner()).to.equal(owner.address);
  });

  it("releases funds to the farmer after buyer confirmation", async function () {
    const [owner, buyer, farmer] = await ethers.getSigners();
    const escrow = await ethers.deployContract("AgriEscrow");
    await escrow.connect(buyer).createOrder(orderId, farmer.address, { value: payment });

    await expect(escrow.connect(buyer).confirmDelivery(orderId))
      .to.emit(escrow, "OrderDeliveryConfirmed")
      .withArgs(orderId, buyer.address);
    await expect(escrow.connect(owner).releaseToFarmer(orderId))
      .to.emit(escrow, "OrderReleased")
      .withArgs(orderId, buyer.address, farmer.address, payment);

    expect((await escrow.orders(orderId)).status).to.equal(2n);
    expect(await ethers.provider.getBalance(await escrow.getAddress())).to.equal(0n);
  });

  it("refunds the buyer when authorized by the owner", async function () {
    const [owner, buyer, farmer] = await ethers.getSigners();
    const escrow = await ethers.deployContract("AgriEscrow");
    await escrow.connect(buyer).createOrder(orderId, farmer.address, { value: payment });

    await expect(escrow.connect(owner).refundBuyer(orderId))
      .to.emit(escrow, "OrderRefunded")
      .withArgs(orderId, buyer.address, farmer.address, payment);

    expect((await escrow.orders(orderId)).status).to.equal(3n);
    expect(await ethers.provider.getBalance(await escrow.getAddress())).to.equal(0n);
  });

  it("blocks release before the buyer confirms delivery", async function () {
    const [, buyer, farmer] = await ethers.getSigners();
    const escrow = await ethers.deployContract("AgriEscrow");
    await escrow.connect(buyer).createOrder(orderId, farmer.address, { value: payment });

    await expect(escrow.releaseToFarmer(orderId)).to.be.revertedWith(
      "Delivery has not been confirmed",
    );
  });

  it("blocks a second release", async function () {
    const [, buyer, farmer] = await ethers.getSigners();
    const escrow = await ethers.deployContract("AgriEscrow");
    await escrow.connect(buyer).createOrder(orderId, farmer.address, { value: payment });
    await escrow.connect(buyer).confirmDelivery(orderId);
    await escrow.releaseToFarmer(orderId);

    await expect(escrow.releaseToFarmer(orderId)).to.be.revertedWith("Order is not funded");
  });

  it("rejects release and refund calls from non-owners", async function () {
    const [, buyer, farmer, other] = await ethers.getSigners();
    const escrow = await ethers.deployContract("AgriEscrow");
    await escrow.connect(buyer).createOrder(orderId, farmer.address, { value: payment });

    await expect(escrow.connect(other).releaseToFarmer(orderId))
      .to.be.revertedWithCustomError(escrow, "OwnableUnauthorizedAccount")
      .withArgs(other.address);
    await expect(escrow.connect(other).refundBuyer(orderId))
      .to.be.revertedWithCustomError(escrow, "OwnableUnauthorizedAccount")
      .withArgs(other.address);
  });

  it("rejects a zero-value order", async function () {
    const [, buyer, farmer] = await ethers.getSigners();
    const escrow = await ethers.deployContract("AgriEscrow");

    await expect(
      escrow.connect(buyer).createOrder(orderId, farmer.address, { value: 0n }),
    ).to.be.revertedWith("Payment must be greater than zero");
  });

  it("allows only the buyer to confirm delivery", async function () {
    const [, buyer, farmer, other] = await ethers.getSigners();
    const escrow = await ethers.deployContract("AgriEscrow");
    await escrow.connect(buyer).createOrder(orderId, farmer.address, { value: payment });

    await expect(escrow.connect(other).confirmDelivery(orderId)).to.be.revertedWith(
      "Only buyer can confirm delivery",
    );
  });

  it("rejects duplicate order IDs", async function () {
    const [, buyer, farmer] = await ethers.getSigners();
    const escrow = await ethers.deployContract("AgriEscrow");
    await escrow.connect(buyer).createOrder(orderId, farmer.address, { value: payment });

    await expect(
      escrow.connect(buyer).createOrder(orderId, farmer.address, { value: payment }),
    ).to.be.revertedWith("Order ID already exists");
  });
});