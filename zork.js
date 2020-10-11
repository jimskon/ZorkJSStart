

var world;
// Actions to get things started
$(document).ready(function () {

    $('#command-btn').click(command);

    var input = document.getElementById("command");
    // Respond to enter key
    input.addEventListener("keyup", function(event) {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        command();
      }
    });
});

// Get things set up
getWorld();

// Print to terminal, and clear the input
function printLine(text) {
  $('#term').append(text+"<br />");
  var objDiv=$('#term')[0];
  objDiv.scrollTop = objDiv.scrollHeight;
}

//Input and process Command
// Called from submit button or enter
function command() {
  com=$('#command').val();
  printLine("<span style='color:blue'>>>> "+com+"</span>");
  $('#command').val('');
  processCommand(world,com.toLowerCase());
}

// Read in XML
function getWorld() {
  console.log("Get World");
  $.ajax({
    url: "zork.xml", // name of file you want to parse
    dataType: "xml",
    success: setupWorld,
    error: function(){alert("Error: Something went wrong reading:zork.xml");}
  });
}

// Take XML and setup world
function setupWorld(xml) {
  console.log("Setup World");
  var map = $(xml).find("map");
  //console.log((new XMLSerializer()).serializeToString(xml));
  world = new World(map);
  world.rooms[world.location].enter()
}

// World Class.  Contains all top level objects
// like rooms, items, creatures, etc
function World(map) {
  console.log("World");
  var self=this;
  self.location="Entrance";
  self.inventory=[];
  self.rooms=[];
  self.items=[];
  // Create associative lists of rooms, items, containerss, and creatures in world
  // works by going through all child of world
  map.children().each(function(index) {
    tag=this.nodeName;
    // Rooms are put in an associative array, mapping room name to room object
    if (tag=="room") {
      let room = new Room(this);
      // add room to associative list of rooms
      self.rooms[room['name']]=room;
    // Items are stored in an  array, mapping room name to room objec
    } else if (tag=="item") {
      let item = new Item(this);
      self.items[item['name']]=item;
    // Process other things in world
    }
  });
  console.log(self.rooms);


}

// Room class
// Contains all room information
// and methods for using a room
function Room(node) {
  var self=this;
  this.name=$(node).find('>name').text();
  this.description=$(node).find('>description').text();
  this.action=$(node).find('>action').text();
  self.items=[];
  self. borders=[]
  // find things in room
  $(node).children().each(function(index) {
    tag=this.nodeName;
    if (tag=="item") {
      self.items.push($(this).text());
    } else if (tag=="border") {
        let border = new Border(this);
        self.borders.push(border);
    }
  });
  this.enter = function() {
    this.describe();
    if (this.action == "exit") {
      printLine("The game is over!");
    }
  }
  this.describe = function() {
    var self=this;
    result=this.description;
    if (this.items.length > 0) {
      result+="<br/>You see:<br/>";
      this.items.forEach(function(item) {
        result+=item+"<br/>";
      });
    } else {
      result+="<br/>Nothing in this room.";
    }
    printLine(result);
  };
  this.lookAround = function() {
    this.borders.forEach(function(b) {
      printLine("If you go "+b.direction+" you will go to "+b.name+".");
    });
  };
  this.checkBorder = function(dir) {
  // Look around the boarders.  if the command given matches
  // a border, return that name of that room
    var to="";
    this.borders.forEach(function(b) {
      if (b.direction==dir) {
        console.log("goto:",b.name);
        to= b.name;
      }
    });
    return to;
  };

}

// Item class
// needs to be completed
// including methods for using items
function Item(node) {
  this.name=$(node).find('>name').text();
  // finish creating item
}

// Border Class
// Used to manage conections between rooms
function Border(node) {
  this.name=$(node).find('>name').text();
  this.direction=$(node).find('>direction').text();
  // finish creating item
}

// routine to take an entered command and process it's acction
function processCommand(world,command) {
  console.log(command);
  c=command.split(" ");
  nextRoom="";
  // Look around
  if (c[0] == "look") {
    world.rooms[world.location].lookAround()
  // Go someplace
  } else if (c[0] == "go") {
    if (c.length<2) {
      printLine("Go where?");
    } else {
      nextRoom=world.rooms[world.location].checkBorder(c[1]);
      console.log("L:",nextRoom);
      if (nextRoom!="" && nextRoom != world.location) {
        world.location=nextRoom;
        world.rooms[world.location].enter();
      } else {
        printLine("Can't go "+c[1]);
      }
    }
  } else if (c[0] == "inventory" || c[0] == "i") {
    printLine("Inventory not yet implemented");
  } else if  (c[0] == "take") {
    printLine("Take not yet implemented");
  } else {
    printLine("Not a command.");
    printLine("Commands: look go inventory take");
  }
}
