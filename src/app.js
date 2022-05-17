App = {
  contracts: {},

  load: async () => {
    await App.loadWeb3(); // connect to Blockchain'
    window.ethereum.enable();
    await App.loadAccount(); // load account
    await App.loadContract(); // load contract
    await App.render(); // render
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      window.alert("Please connect to Metamask.");
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      ethereum.enable();
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },

  loadAccount: async () => {
    App.account = await web3.eth.accounts[0];
    web3.eth.defaultAccount=web3.eth.accounts[0]
    console.log(App.account)
  },

  loadContract: async () => {
    const todoList = await $.getJSON("TodoList.json");
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(App.web3Provider);

    // Hydrate the form with the contract value.
    App.todoList = await App.contracts.TodoList.deployed();
  },

  render: async () => {
    if (App.loading) {
      return;
    }

    // Prevent double render
    App.setLoading(true);

    // Render Account
    $("#account").html(App.account);

    // Render Tasks
    await App.renderTasks();

    // remove loading
    App.setLoading(false);
  },

  createTask: async () => {
    const task = $("#newTask").val();
    console.log(task)
    await App.todoList.createTask(task);
    window.location.reload();
  },

  renderTasks: async () => {
    // Load the total task count from the contract
    const taskCount = await App.todoList.taskCount();
    const $taskTemplate = $(".taskTemplate");

    for (let index = 1; index < taskCount; index++) {
      const task = await App.todoList.tasks(index);
      const taskId = task[0].toNumber();
      const taskName = task[1];
      const taskDone = task[2];
      //   console.log('Name: ' + task);
      //   console.log('Name: ' + taskName);
      const $newTaskTemplate = $taskTemplate.clone();
      $newTaskTemplate.find(".content").html(taskName);
      $newTaskTemplate
        .find("input")
        .prop("name", taskId)
        .prop("checked", taskDone);

      if (taskDone) {
        $("#tasksDone").append($newTaskTemplate);
      } else {
        $("#taskList").append($newTaskTemplate);
      }

      $newTaskTemplate.show();
    }

    // Render out each task with a new task template
  },

  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $("#loader");
    const content = $("#content");

    if (boolean) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },
};

$(() => {
  $(window).load(() => {
    App.load();
  });
});
