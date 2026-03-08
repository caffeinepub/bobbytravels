import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public type OldUserProfile = {
    name : Text;
    phone : ?Text;
    email : Text;
  };

  public type OldFlightEnquiry = {
    id : Nat;
    origin : Text;
    destination : Text;
    departureDate : Text;
    returnDate : ?Text;
    tripType : {
      #oneWay;
      #returnTrip;
      #isFlexible;
    };
    passengerCount : Nat;
    specialRequests : ?Text;
    timestamp : Int;
  };

  public type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    nextEnquiryId : Nat;
    flightEnquiries : List.List<OldFlightEnquiry>;
  };

  public type NewUserProfile = OldUserProfile;

  public type NewFlightEnquiry = {
    id : Nat;
    customerName : Text;
    customerPhone : Text;
    customerEmail : ?Text;
    origin : Text;
    destination : Text;
    departureDate : Text;
    returnDate : ?Text;
    tripType : {
      #oneWay;
      #returnTrip;
      #isFlexible;
    };
    passengerCount : Nat;
    specialRequests : ?Text;
    timestamp : Int;
  };

  public type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    nextEnquiryId : Nat;
    flightEnquiries : List.List<NewFlightEnquiry>;
  };

  public func run(old : OldActor) : NewActor {
    let newFlightEnquiries = old.flightEnquiries.map<OldFlightEnquiry, NewFlightEnquiry>(
      func(oldEnquiry) {
        {
          oldEnquiry with
          customerName = "Unknown";
          customerPhone = "Not Provided";
          customerEmail = null;
        };
      }
    );
    {
      old with
      flightEnquiries = newFlightEnquiries
    };
  };
};
