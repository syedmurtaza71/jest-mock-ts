// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is ReentrancyGuard, Ownable {
  // using Counters for Counters.Counter;

  // Counters.Counter public _nftCount; //total count of nfts
  uint256 public _nftCount;
  address[] public collectionAddresses; //array of collection addresses

  mapping(address => uint256[]) public collections; // an array of nfts mapped to the collection contract
  mapping(address => mapping(uint256 => Nft)) public nfts; //nested mapping to the struct of nft
  mapping(address => string) public collectionType; //mapping for the collection type e.g ERC721, ERC1155
  
  //struct for the nft
  struct Nft {
    address collectionAddress;
    uint256 nftId;
    uint256 price;
    bool featuredStatus;
  }

  //event when an NFT is bough
  event NftTransferred(
    address indexed collectionContract,
    uint256 indexed nftId,
    uint256 price,
    address buyer,
    bool featuredStatus
  );

  //event when listing collection
  event Listed(
    address indexed collectionContract,
    uint256[] indexed nftId,
    uint256[] price,
    bool[] featuredStatus,
    string _type
  );

  modifier addressZero(address collectionAddress) {
    require(collectionAddress != address(0), "This is not a valid address!");
    _;
  }

  modifier exists(address collectionAddress, uint256 nftId) {
    require(
      nfts[collectionAddress][nftId].collectionAddress != address(0),
      "Nft not found"
    );
    _;
  }

  //function to list the collection
  function listCollection(
    address collectionContract,
    uint256[] memory nftId,
    uint256[] memory price,
    bool[] memory featuredStatus,
    string memory _type
  ) external onlyOwner addressZero(collectionContract) {
    uint256[] memory newArray = new uint256[](nftId.length);
    uint256 nftTotal = nftId.length;
    require(
      nftTotal == price.length && nftTotal == featuredStatus.length,
      "NftIds, Prices & FeaturedStatus must have same length"
    );
    for (uint256 i = 0; i < nftTotal; i++) {
      require(price[i] > 0, "price must be atleast 1 wei");
      newArray[i] = nftId[i];
      nfts[collectionContract][nftId[i]] = Nft(
        collectionContract,
        nftId[i],
        price[i],
        featuredStatus[i]
      );
    }
    _nftCount += nftTotal;
    if (
      keccak256(abi.encodePacked(collectionType[collectionContract])) ==
      keccak256(abi.encodePacked(""))
    ) {
      collectionAddresses.push(collectionContract);
    } else {
      uint256[] memory nftArrExisting = collections[collectionContract];
      uint256 existing = nftArrExisting.length;
      _nftCount -= existing;
    }
    collections[collectionContract] = newArray;
    collectionType[collectionContract] = _type;

    emit Listed(collectionContract, nftId, price, featuredStatus, _type); //emitting the event
  }

  //function to update the nft
  function updateNft(
    address collectionContract,
    uint256 nftId,
    uint256 price,
    bool featuredStatus
  ) external onlyOwner exists(collectionContract, nftId) {
    require(price > 0, "price must be atleast 1 wei");
    Nft storage n = nfts[collectionContract][nftId];
    n.price = price; //updating the price of the nft struct
    n.featuredStatus = featuredStatus; //updating the featured status of the nft struct
  }

  //function to buy an nft
  function buyNft(
    address collectionContract,
    uint256 nftId
  ) external payable nonReentrant exists(collectionContract, nftId) {
    uint256 price = nfts[collectionContract][nftId].price;
    require(
      msg.value == price,
      "The amount you entered does not match the price"
    );
    bool featuredStatus = nfts[collectionContract][nftId].featuredStatus;
    address owner = owner();
    payable(owner).transfer(price);
    if (
      keccak256(abi.encodePacked(collectionType[collectionContract])) ==
      keccak256(abi.encodePacked("ERC721"))
    ) {
      IERC721(collectionContract).safeTransferFrom(owner, msg.sender, nftId); //erc721 transfer
    } else {
      IERC1155(collectionContract).safeTransferFrom( //erc1155 transfer
        owner,
        msg.sender,
        nftId,
        1,
        ""
      );
    }

    delist(collectionContract, nftId); //calling the delist function internally
    emit NftTransferred( //emitting the event
      collectionContract,
      nftId,
      price,
      msg.sender,
      featuredStatus
    );
  }

  //function to get all the listed nfts
  function getAllListedNfts() external view returns (Nft[] memory) {
    Nft[] memory n = new Nft[](_nftCount);
    uint256 k = 0;
    for (uint256 i = 0; i < collectionAddresses.length; i++) {
      uint256[] memory nftArr = collections[collectionAddresses[i]];
      for (uint256 j = 0; j < nftArr.length; j++) {
        n[k] = nfts[collectionAddresses[i]][nftArr[j]];
        k++;
      }
    }
    return n;
  }

  //function to get listed NFT
  function getListedNft(
    address collectionContract,
    uint256 nftId
  ) external view exists(collectionContract, nftId) returns (Nft memory) {
    return nfts[collectionContract][nftId];
  }

  //function to delist an nft
  function delistNFT(
    address collectionContract,
    uint256 nftId
  ) public onlyOwner exists(collectionContract, nftId) {
    delist(collectionContract, nftId);
  }

  //function to delist the collection
  function delistCollection(
    address collectionContract
  ) external onlyOwner addressZero(collectionContract) {
    uint256[] memory nftArr = collections[collectionContract];
    for (uint256 i = 0; i < nftArr.length; i++) {
      delete nfts[collectionContract][nftArr[i]];
    }
    _nftCount -= nftArr.length;
    for (uint256 i = 0; i < collectionAddresses.length; i++) {
      if (collectionAddresses[i] == collectionContract) {
        collectionAddresses[i] = collectionAddresses[
          collectionAddresses.length - 1
        ];
        collectionAddresses.pop();
      }
    }
    delete collections[collectionContract];
    delete collectionType[collectionContract];
  }

  //function delist
  function delist(address collectionContract, uint256 nftId) internal {
    uint256[] storage nftArr = collections[collectionContract];
    for (uint256 i = 0; i < nftArr.length; i++) {
      if (nftArr[i] == nftId) {
        nftArr[i] = nftArr[nftArr.length - 1];
        nftArr.pop();
        collections[collectionContract] = nftArr;
        delete nfts[collectionContract][nftId];
        _nftCount -= 1;
      }
    }
  }
}