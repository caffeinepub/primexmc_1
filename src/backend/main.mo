import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

actor {
  type ItemType = { #rank; #crate };

  type Order = {
    id : Nat;
    username : Text;
    itemName : Text;
    itemType : ItemType;
    price : Float;
    quantity : Nat;
    timestamp : Int;
  };

  type Rank = {
    name : Text;
    price : Float;
  };

  type Crate = {
    name : Text;
    price : Float;
    unit : Text;
  };

  // Use persistent Map data structure for orders
  let orders = Map.empty<Nat, Order>();

  // Persistent order ID counter
  var nextOrderId = 1;

  // Predefined items
  let ranks = [
    { name = "VIP"; price = 9.99 },
    { name = "VIP+ "; price = 19.99 },
    { name = "MVP"; price = 29.99 },
    { name = "MVP+ "; price = 39.99 },
  ];

  let crates = [
    { name = "Skyblock Crate"; price = 4.99; unit = "/pk" },
    { name = "Survival Crate"; price = 3.99; unit = "/pk" },
    { name = "PvP Crate"; price = 5.49; unit = "/pk" },
  ];

  public shared ({ caller }) func submitOrder(
    username : Text,
    itemName : Text,
    itemTypeText : Text,
    price : Float,
    quantity : Nat,
  ) : async Nat {
    let itemType = switch (itemTypeText.toLower()) {
      case ("rank") { #rank };
      case ("crate") { #crate };
      case (_) { Runtime.trap("Invalid item type") };
    };

    let orderId = nextOrderId;
    nextOrderId += 1;

    let newOrder : Order = {
      id = orderId;
      username;
      itemName;
      itemType;
      price;
      quantity;
      timestamp = Time.now();
    };

    orders.add(orderId, newOrder);

    orderId;
  };

  public query ({ caller }) func getOrdersByUsername(username : Text) : async [Order] {
    orders.values().toArray().filter(
      func(o) {
        Text.equal(o.username, username);
      }
    );
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    orders.values().toArray();
  };

  public query ({ caller }) func getOrderCount() : async Nat {
    orders.size();
  };

  public query ({ caller }) func getRanks() : async [Rank] {
    ranks;
  };

  public query ({ caller }) func getCrates() : async [Crate] {
    crates;
  };
};
