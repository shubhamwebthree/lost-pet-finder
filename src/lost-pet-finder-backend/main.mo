import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Array "mo:base/Array";

actor PetFinder {

  type PetId = Nat;
  type Status = { #Lost; #Found };
  
  type Pet = {
    id: PetId;
    owner: Principal;
    status: Status;
    petType: Text;
    description: Text;
    photo: Blob;
    location: Text;
    contact: Text;
    timestamp: Time.Time;
    resolved: Bool;
  };

   stable var nextId = 0;
      // nextId := 0;  
  private var pets = HashMap.HashMap<PetId, Pet>(10, Nat.equal, func(n: Nat) : Nat32 { Nat32.fromNat(n) });
  private stable var petsBackup : [(PetId, Pet)] = [];

  system func preupgrade() { petsBackup := Iter.toArray(pets.entries()) };
  system func postupgrade() { 
    pets := HashMap.fromIter<PetId, Pet>(petsBackup.vals(), 10, Nat.equal, func(n: Nat) : Nat32 { Nat32.fromNat(n) });
    petsBackup := [];
  };

  public shared({caller}) func reportPet(
    status: Status,
    petType: Text,
    description: Text,
    photo: Blob,
    location: Text,
    contact: Text
  ) : async PetId {
    let id = nextId;
    nextId += 1;

    let pet : Pet = {
      id;
      owner = caller;
      status;
      petType;
      description;
      photo;
      location;
      contact;
      timestamp = Time.now();
      resolved = false;
    };

    pets.put(id, pet);
    return id;
  };

  public query func getPet(id: PetId) : async ?Pet {
    pets.get(id)
  };

  public shared({caller}) func resolve(id: PetId) : async Result.Result<(), Text> {
    switch (pets.get(id)) {
      case null { #err("Pet not found") };
      case (?pet) {
        if (pet.owner != caller) {
          return #err("Not authorized");
        };

        let updatedPet: Pet = {
          id = pet.id;
          owner = pet.owner;
          status = pet.status;
          petType = pet.petType;
          description = pet.description;
          photo = pet.photo;
          location = pet.location;
          contact = pet.contact;
          timestamp = pet.timestamp;
          resolved = true;
        };

        pets.put(id, updatedPet);
        #ok()
      };
    };
  };

  public query func getAllPets() : async [Pet] {
    Iter.toArray(pets.vals())
  };

  public query func searchPets(status: ?Status, petType: ?Text) : async [Pet] {
    var results : [Pet] = [];

    for ((_, pet) in pets.entries()) {
      if (statusMatches(status, pet) and typeMatches(petType, pet)) {
        results := Array.append<Pet>(results, [pet]);
      };
    };

    return results;
  };

  private func statusMatches(status: ?Status, pet: Pet) : Bool {
    switch (status) {
      case null { true };
      case (?s) { s == pet.status };
    };
  };

  private func typeMatches(petType: ?Text, pet: Pet) : Bool {
    switch (petType) {
      case null { true };
      case (?t) { Text.contains(pet.petType, #text t) };
    };
  };
};
