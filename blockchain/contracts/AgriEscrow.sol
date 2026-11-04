// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract AgriEscrow is Ownable, ReentrancyGuard {
    enum OrderStatus {
        None,
        Funded,
        Released,
        Refunded
    }

    struct Order {
        address payable buyer;
        address payable farmer;
        uint256 amount;
        OrderStatus status;
        bool deliveryConfirmed;
    }

    mapping(bytes32 orderId => Order order) public orders;

    event OrderFunded(
        bytes32 indexed orderId,
        address indexed buyer,
        address indexed farmer,
        uint256 amount
    );
    event OrderDeliveryConfirmed(bytes32 indexed orderId, address indexed buyer);
    event OrderReleased(
        bytes32 indexed orderId,
        address indexed buyer,
        address indexed farmer,
        uint256 amount
    );
    event OrderRefunded(
        bytes32 indexed orderId,
        address indexed buyer,
        address indexed farmer,
        uint256 amount
    );

    constructor() Ownable(msg.sender) {}

    function createOrder(bytes32 orderId, address farmer) external payable nonReentrant {
        require(orderId != bytes32(0), "Invalid order ID");
        require(farmer != address(0), "Invalid farmer address");
        require(msg.value > 0, "Payment must be greater than zero");
        require(orders[orderId].status == OrderStatus.None, "Order ID already exists");

        orders[orderId] = Order({
            buyer: payable(msg.sender),
            farmer: payable(farmer),
            amount: msg.value,
            status: OrderStatus.Funded,
            deliveryConfirmed: false
        });

        emit OrderFunded(orderId, msg.sender, farmer, msg.value);
    }

    function confirmDelivery(bytes32 orderId) external {
        Order storage order = orders[orderId];
        require(order.status == OrderStatus.Funded, "Order is not funded");
        require(msg.sender == order.buyer, "Only buyer can confirm delivery");

        order.deliveryConfirmed = true;
        emit OrderDeliveryConfirmed(orderId, msg.sender);
    }

    function releaseToFarmer(bytes32 orderId) external onlyOwner nonReentrant {
        Order storage order = orders[orderId];
        require(order.status == OrderStatus.Funded, "Order is not funded");
        require(order.deliveryConfirmed, "Delivery has not been confirmed");

        uint256 amount = order.amount;
        order.status = OrderStatus.Released;

        (bool success, ) = order.farmer.call{value: amount}("");
        require(success, "Farmer payment failed");

        emit OrderReleased(orderId, order.buyer, order.farmer, amount);
    }

    function refundBuyer(bytes32 orderId) external onlyOwner nonReentrant {
        Order storage order = orders[orderId];
        require(order.status == OrderStatus.Funded, "Order is not funded");

        uint256 amount = order.amount;
        order.status = OrderStatus.Refunded;

        (bool success, ) = order.buyer.call{value: amount}("");
        require(success, "Buyer refund failed");

        emit OrderRefunded(orderId, order.buyer, order.farmer, amount);
    }
}