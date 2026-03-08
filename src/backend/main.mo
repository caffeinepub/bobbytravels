import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Include authorization component
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    phone : ?Text;
    email : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can see their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type TripType = {
    #oneWay;
    #returnTrip;
    #isFlexible;
  };

  public type FlightEnquiry = {
    id : Nat;
    origin : Text;
    destination : Text;
    departureDate : Text;
    returnDate : ?Text;
    tripType : TripType;
    passengerCount : Nat;
    specialRequests : ?Text;
    timestamp : Int;
  };

  var nextEnquiryId = 1;
  let flightEnquiries = List.empty<FlightEnquiry>();

  public shared ({ caller }) func submitEnquiry(
    origin : Text,
    destination : Text,
    departureDate : Text,
    returnDate : ?Text,
    tripType : TripType,
    passengerCount : Nat,
    specialRequests : ?Text,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can submit enquiries");
    };
    let enquiry : FlightEnquiry = {
      id = nextEnquiryId;
      origin;
      destination;
      departureDate;
      returnDate;
      tripType;
      passengerCount;
      specialRequests;
      timestamp = Time.now();
    };
    flightEnquiries.add(enquiry);
    nextEnquiryId += 1;
  };

  public query ({ caller }) func getAllEnquiries() : async [FlightEnquiry] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all enquiries");
    };
    flightEnquiries.reverse().toArray();
  };
};
