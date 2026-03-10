import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  type TripType = {
    #oneWay;
    #returnTrip;
    #isFlexible;
  };

  type OldFlightEnquiry = {
    id : Nat;
    customerName : Text;
    customerPhone : Text;
    customerEmail : ?Text;
    origin : Text;
    destination : Text;
    departureDate : Text;
    returnDate : ?Text;
    tripType : TripType;
    passengerCount : Nat;
    specialRequests : ?Text;
    timestamp : Int;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal.Principal, { name : Text; phone : ?Text; email : Text }>;
    flightEnquiries : List.List<OldFlightEnquiry>;
    nextEnquiryId : Nat;
  };

  type NewFlightEnquiry = {
    id : Nat;
    customerName : Text;
    customerPhone : Text;
    customerEmail : ?Text;
    origin : Text;
    destination : Text;
    departureDate : Text;
    returnDate : ?Text;
    tripType : TripType;
    adultsCount : Nat;
    childrenCount : Nat;
    infantsCount : Nat;
    cabinClass : ?Text;
    specialRequests : ?Text;
    status : Text;
  };

  type NewActor = {
    flightEnquiries : Map.Map<Nat, NewFlightEnquiry>;
    nextFlightEnquiryId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newFlightEnquiries = Map.empty<Nat, NewFlightEnquiry>();

    for (oldFlightEnquiry in old.flightEnquiries.values()) {
      let newFlightEnquiry : NewFlightEnquiry = {
        id = oldFlightEnquiry.id;
        customerName = oldFlightEnquiry.customerName;
        customerPhone = oldFlightEnquiry.customerPhone;
        customerEmail = oldFlightEnquiry.customerEmail;
        origin = oldFlightEnquiry.origin;
        destination = oldFlightEnquiry.destination;
        departureDate = oldFlightEnquiry.departureDate;
        returnDate = oldFlightEnquiry.returnDate;
        tripType = oldFlightEnquiry.tripType;
        adultsCount = oldFlightEnquiry.passengerCount;
        childrenCount = 0;
        infantsCount = 0;
        cabinClass = null;
        specialRequests = oldFlightEnquiry.specialRequests;
        status = "pending";
      };

      newFlightEnquiries.add(oldFlightEnquiry.id, newFlightEnquiry);
    };

    {
      flightEnquiries = newFlightEnquiries;
      nextFlightEnquiryId = old.nextEnquiryId;
    };
  };
};
