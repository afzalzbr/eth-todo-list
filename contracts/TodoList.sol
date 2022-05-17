// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
    uint public taskCount = 0;
    struct Task {
        uint id;
        string name;
        bool done;
    }
    
    mapping(uint => Task) public tasks;

    constructor() public {
        createTask('Check out this amaing contract!');
    }

    function createTask(string memory _name) public {
        taskCount ++;
        tasks[taskCount] = Task(taskCount, _name, false);
    }
}