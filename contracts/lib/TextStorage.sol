//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";

contract TextStorage {
    mapping(uint256 => bytes32) private lengths;
    mapping(uint256 => bytes32) private datas;

    function _storeText(uint256 _tokenId, string memory _string) internal {
        bytes32 _length = keccak256(
            abi.encodePacked("textstoragelocation0", _tokenId)
        );
        bytes32 _data = keccak256(abi.encodePacked(_length));
        lengths[_tokenId] = _length;
        datas[_tokenId] = _data;

        assembly {
            let stringLength := mload(_string)

            switch gt(stringLength, 0x1F)
            // If string length <= 31 we store a short array
            // length storage variable layout :
            // bytes 0 - 31 : string data
            // byte 32 : length * 2
            // data storage variable is UNUSED in this case
            case 0x00 {
                sstore(
                    _length,
                    or(mload(add(_string, 0x20)), mul(stringLength, 2))
                )
            }
            // If string length > 31 we store a long array
            // length storage variable layout :
            // bytes 0 - 32 : length * 2 + 1
            // data storage layout :
            // bytes 0 - 32 : string data
            // If more than 32 bytes are required for the string we write them
            // to the slot(s) following the slot of the data storage variable
            case 0x01 {
                // Store length * 2 + 1 at slot length
                sstore(_length, add(mul(stringLength, 2), 1))

                // Then store the string content by blocks of 32 bytes
                for {
                    let i := 0
                } lt(mul(i, 0x20), stringLength) {
                    i := add(i, 0x01)
                } {
                    sstore(
                        add(_data, i),
                        mload(add(_string, mul(add(i, 1), 0x20)))
                    )
                }
            }
        }
    }

    function readText(uint256 _tokenId)
        public
        view
        returns (string memory returnBuffer)
    {
        bytes32 _length = lengths[_tokenId];
        bytes32 _data = datas[_tokenId];

        assembly {
            let stringLength := sload(_length)

            // Check if what type of array we are dealing with
            // The return array will need to be taken from STORAGE
            // respecting the STORAGE layout of string, but rebuilt
            // in MEMORY according to the MEMORY layout of string.
            switch and(stringLength, 0x01)
            // Short array
            case 0x00 {
                let decodedStringLength := div(and(stringLength, 0xFF), 2)

                // Add length in first 32 byte slot
                mstore(returnBuffer, decodedStringLength)
                mstore(add(returnBuffer, 0x20), and(stringLength, not(0xFF)))
                mstore(0x40, add(returnBuffer, 0x40))
            }
            // Long array
            case 0x01 {
                let decodedStringLength := div(stringLength, 2)
                let i := 0

                mstore(returnBuffer, decodedStringLength)

                // Write to memory as many blocks of 32 bytes as necessary taken from data storage variable slot + i
                for {

                } lt(mul(i, 0x20), decodedStringLength) {
                    i := add(i, 0x01)
                } {
                    mstore(
                        add(add(returnBuffer, 0x20), mul(i, 0x20)),
                        sload(add(_data, i))
                    )
                }

                mstore(0x40, add(returnBuffer, add(0x20, mul(i, 0x20))))
            }
        }
    }
}
