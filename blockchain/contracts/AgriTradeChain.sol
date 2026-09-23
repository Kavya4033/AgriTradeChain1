// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgriTradeChain {
    
    struct CropListing {
        uint256 id;
        address payable farmer;
        string cropType;
        uint256 quantity; // in kg
        uint256 priceInWei; // Price in Wei (1 ETH = 10^18 Wei)
        bool isSold;
        bool isDelivered;
    }

    uint256 public listingCount = 0;
    mapping(uint256 => CropListing) public listings;

    // Events to notify your Node.js backend or Frontend react code
    event ListingCreated(uint256 id, address farmer, string cropType, uint256 quantity, uint256 price);
    event CropPurchased(uint256 id, address buyer, address farmer, uint256 price);
    event DeliveryConfirmed(uint256 id);

    // 1. Create a crop listing on the blockchain
    function createListing(string memory _cropType, uint256 _quantity, uint256 _priceInWei) public {
        require(_quantity > 0, "Quantity must be greater than 0");
        require(_priceInWei > 0, "Price must be greater than 0");

        listingCount++;
        listings[listingCount] = CropListing(
            listingCount,
            payable(msg.sender),
            _cropType,
            _quantity,
            _priceInWei,
            false,
            false
        );

        emit ListingCreated(listingCount, msg.sender, _cropType, _quantity, _priceInWei);
    }

    // 2. Buyer purchases the crop (The crypto funds are held safely in this contract escrow)
    function purchaseCrop(uint256 _id) public payable {
        CropListing storage listing = listings[_id];
        
        require(listing.id > 0 && listing.id <= listingCount, "Listing does not exist");
        require(msg.value >= listing.priceInWei, "Incorrect ETH amount sent");
        require(!listing.isSold, "Crop already sold");

        listing.isSold = true;

        emit CropPurchased(_id, msg.sender, listing.farmer, listing.priceInWei);
    }

    // 3. Confirm delivery (Safely releases the held escrow funds directly to the farmer's wallet)
    function confirmDelivery(uint256 _id) public {
        CropListing storage listing = listings[_id];
        
        require(listing.isSold, "Crop hasn't been bought yet");
        require(!listing.isDelivered, "Delivery already confirmed");
        
        listing.isDelivered = true;
        
        // Securely transfer held crypto using call instead of transfer
        (bool success, ) = listing.farmer.call{value: listing.priceInWei}("");
        require(success, "Transfer to farmer failed");

        emit DeliveryConfirmed(_id);
    }
}
