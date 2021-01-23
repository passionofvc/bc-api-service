pragma solidity ^0.7.1;
pragma experimental ABIEncoderV2;
// SPDX-License-Identifier: MIT

contract SimpleStructStorage {
    struct Data {
        uint Id;
        string Name;
    } 
    
    Data storedData;

    event SET(Data d);

    function set(Data memory x) public {
        storedData = x;
        emit SET(x);
    }

    function get() public view returns (Data memory x) {
        return storedData;
    }
}
