import Map "mo:core/Map";
import Int "mo:core/Int";
import List "mo:core/List";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Prim "mo:prim";

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

  func ensureUserRegistered(caller : Principal) {
    switch (accessControlState.userRoles.get(caller)) {
      case (null) {
        accessControlState.userRoles.add(caller, #user);
      };
      case (?#guest) {
        accessControlState.userRoles.add(caller, #user);
      };
      case (_) {};
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller.isAnonymous() and caller != user) {
      Runtime.trap("Unauthorized: Only the user or admin can view this profile (anonymous caller)");
    };

    if (caller == user) {
      return userProfiles.get(user);
    };

    switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) {
        userProfiles.get(user);
      };
      case (_) {
        Runtime.trap("Unauthorized: Only the user or admin can view this profile");
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous callers cannot register profiles");
    };
    ensureUserRegistered(caller);
    userProfiles.add(caller, profile);
  };

  public type TripType = {
    #oneWay;
    #returnTrip;
    #isFlexible;
  };

  public type FlightEnquiry = {
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

  public type FlightEnquiryInput = {
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
  };

  var nextEnquiryId = 1;
  let flightEnquiries = List.empty<FlightEnquiry>();

  public shared ({ caller }) func submitEnquiry(input : FlightEnquiryInput) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous callers cannot submit enquiries");
    };
    ensureUserRegistered(caller);

    let enquiry : FlightEnquiry = {
      id = nextEnquiryId;
      customerName = input.customerName;
      customerPhone = input.customerPhone;
      customerEmail = input.customerEmail;
      origin = input.origin;
      destination = input.destination;
      departureDate = input.departureDate;
      returnDate = input.returnDate;
      tripType = input.tripType;
      passengerCount = input.passengerCount;
      specialRequests = input.specialRequests;
      timestamp = Time.now();
    };

    flightEnquiries.add(enquiry);
    nextEnquiryId += 1;
  };

  public query ({ caller }) func getAllEnquiries() : async [FlightEnquiry] {
    switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) {
        flightEnquiries.reverse().toArray();
      };
      case (_) {
        Runtime.trap("Unauthorized: Only admins can view all enquiries");
      };
    };
  };

  public shared ({ caller }) func claimAdminAccess(secret : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous callers cannot claim admin access");
    };

    switch (Prim.envVar<system>("CAFFEINE_ADMIN_TOKEN")) {
      case (null) {
        Runtime.trap("Admin token not configured");
      };
      case (?token) {
        if (secret == token) {
          accessControlState.userRoles.add(caller, #admin);
        } else {
          Runtime.trap("Invalid admin token");
        };
      };
    };
  };
};
