import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Migrate old stable state to new stable state using migration module
(with migration = Migration.run)
actor {
  let adminEmail = "adityabholath@gmail.com";
  var nextUserId = 1;
  var nextFlightEnquiryId = 1;
  var nextVisaEnquiryId = 1;
  var nextTourEnquiryId = 1;
  var nextPNREnquiryId = 1;

  public type User = {
    id : Nat;
    email : Text;
    passwordHash : Text;
    name : Text;
    phone : ?Text;
    isAdmin : Bool;
  };

  public type UserProfile = {
    name : Text;
    phone : ?Text;
    email : Text;
  };

  public type SessionToken = Text;

  let users = Map.empty<Nat, User>();
  let usersByEmail = Map.empty<Text, Nat>();
  let sessions = Map.empty<SessionToken, Principal>();
  let principalToUser = Map.empty<Principal, Nat>();
  let userProfiles = Map.empty<Principal, UserProfile>();

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
    adultsCount : Nat;
    childrenCount : Nat;
    infantsCount : Nat;
    cabinClass : ?Text;
    specialRequests : ?Text;
    status : Text;
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
    adultsCount : Nat;
    childrenCount : Nat;
    infantsCount : Nat;
    cabinClass : ?Text;
    specialRequests : ?Text;
  };

  let flightEnquiries = Map.empty<Nat, FlightEnquiry>();

  public type VisaEnquiry = {
    id : Nat;
    customerName : Text;
    customerPhone : Text;
    customerEmail : ?Text;
    country : Text;
    visaType : Text;
    travelDate : Text;
    passportNumber : ?Text;
    specialNotes : ?Text;
    status : Text;
  };

  public type VisaEnquiryInput = {
    customerName : Text;
    customerPhone : Text;
    customerEmail : ?Text;
    country : Text;
    visaType : Text;
    travelDate : Text;
    passportNumber : ?Text;
    specialNotes : ?Text;
  };

  let visaEnquiries = Map.empty<Nat, VisaEnquiry>();

  public type TourEnquiry = {
    id : Nat;
    customerName : Text;
    customerPhone : Text;
    customerEmail : ?Text;
    tourPackage : Text;
    travelDate : Text;
    adultsCount : Nat;
    childrenCount : Nat;
    budget : ?Text;
    specialRequests : ?Text;
    status : Text;
  };

  public type TourEnquiryInput = {
    customerName : Text;
    customerPhone : Text;
    customerEmail : ?Text;
    tourPackage : Text;
    travelDate : Text;
    adultsCount : Nat;
    childrenCount : Nat;
    budget : ?Text;
    specialRequests : ?Text;
  };

  let tourEnquiries = Map.empty<Nat, TourEnquiry>();

  public type PNREnquiry = {
    id : Nat;
    customerName : Text;
    customerPhone : Text;
    customerEmail : ?Text;
    pnrNumber : Text;
    airline : Text;
    travelDate : ?Text;
    notes : ?Text;
  };

  public type PNREnquiryInput = {
    customerName : Text;
    customerPhone : Text;
    customerEmail : ?Text;
    pnrNumber : Text;
    airline : Text;
    travelDate : ?Text;
    notes : ?Text;
  };

  let pnrEnquiries = Map.empty<Nat, PNREnquiry>();

  public type AdminStats = {
    totalFlightEnquiries : Nat;
    totalVisaEnquiries : Nat;
    totalTourEnquiries : Nat;
    totalPNREnquiries : Nat;
    totalUsers : Nat;
  };

  func generateToken(email : Text) : SessionToken {
    let timestamp = Int.abs(Time.now());
    let toHash = email.concat(timestamp.toText());
    toHash;
  };

  func generatePrincipalFromEmail(email : Text) : Principal {
    let timestamp = Int.abs(Time.now());
    let uniqueString = email.concat(timestamp.toText());
    Principal.fromText(uniqueString # ".0"); // Faking conversion from email to Principal for demonstration
  };

  // Include authorization component
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management (required by instructions)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func registerUser(email : Text, passwordHash : Text, name : Text, phone : ?Text) : async SessionToken {
    // Check if user already exists
    switch (usersByEmail.get(email)) {
      case (?_) { Runtime.trap("User with this email already exists") };
      case (null) {};
    };

    let isAdmin = email == adminEmail;
    let userPrincipal = generatePrincipalFromEmail(email);

    let user : User = {
      id = nextUserId;
      email;
      passwordHash;
      name;
      phone;
      isAdmin;
    };

    users.add(nextUserId, user);
    usersByEmail.add(email, nextUserId);
    principalToUser.add(userPrincipal, nextUserId);
    nextUserId += 1;

    // Set up user profile
    let profile : UserProfile = {
      name = name;
      phone = phone;
      email = email;
    };
    userProfiles.add(userPrincipal, profile);

    // Assign role in AccessControl system
    if (isAdmin) {
      AccessControl.assignRole(accessControlState, userPrincipal, userPrincipal, #admin);
    } else {
      AccessControl.assignRole(accessControlState, userPrincipal, userPrincipal, #user);
    };

    let token = generateToken(email);
    sessions.add(token, userPrincipal);
    token;
  };

  public shared ({ caller }) func loginUser(email : Text, passwordHash : Text) : async SessionToken {
    switch (usersByEmail.get(email)) {
      case (?userId) {
        switch (users.get(userId)) {
          case (?user) {
            if (user.passwordHash != passwordHash) {
              Runtime.trap("Invalid email or password");
            };

            let userPrincipal = generatePrincipalFromEmail(email);
            let token = generateToken(email);
            sessions.add(token, userPrincipal);
            token;
          };
          case (null) { Runtime.trap("Invalid email or password") };
        };
      };
      case (null) { Runtime.trap("Invalid email or password") };
    };
  };

  public query ({ caller }) func validateSession(token : SessionToken) : async ?User {
    switch (sessions.get(token)) {
      case (?userPrincipal) {
        switch (principalToUser.get(userPrincipal)) {
          case (?userId) { users.get(userId) };
          case (null) { null };
        };
      };
      case (null) { null };
    };
  };

  func getPrincipalFromToken(token : SessionToken) : ?Principal {
    sessions.get(token);
  };

  func requireAdminByToken(token : SessionToken) {
    switch (getPrincipalFromToken(token)) {
      case (?userPrincipal) {
        if (not AccessControl.isAdmin(accessControlState, userPrincipal)) {
          Runtime.trap("Unauthorized: Admins only");
        };
      };
      case (null) { Runtime.trap("Invalid session token") };
    };
  };

  public query ({ caller }) func getAllUsers(token : SessionToken) : async [(Nat, User)] {
    requireAdminByToken(token);
    users.toArray();
  };

  // Flight Enquiries - Public submission (no auth required)
  public shared ({ caller }) func submitFlightEnquiry(input : FlightEnquiryInput) : async Nat {
    // No authorization check - anonymous submissions allowed
    let enquiry : FlightEnquiry = {
      id = nextFlightEnquiryId;
      customerName = input.customerName;
      customerPhone = input.customerPhone;
      customerEmail = input.customerEmail;
      origin = input.origin;
      destination = input.destination;
      departureDate = input.departureDate;
      returnDate = input.returnDate;
      tripType = input.tripType;
      adultsCount = input.adultsCount;
      childrenCount = input.childrenCount;
      infantsCount = input.infantsCount;
      cabinClass = input.cabinClass;
      specialRequests = input.specialRequests;
      status = "pending";
    };

    flightEnquiries.add(nextFlightEnquiryId, enquiry);
    nextFlightEnquiryId += 1;
    enquiry.id;
  };

  public query ({ caller }) func getAllFlightEnquiries(token : SessionToken) : async [(Nat, FlightEnquiry)] {
    requireAdminByToken(token);
    flightEnquiries.toArray();
  };

  public shared ({ caller }) func updateFlightEnquiryStatus(token : SessionToken, id : Nat, status : Text) : async () {
    requireAdminByToken(token);
    switch (flightEnquiries.get(id)) {
      case (?enquiry) {
        let updatedEnquiry = { enquiry with status };
        flightEnquiries.add(id, updatedEnquiry);
      };
      case (null) { Runtime.trap("Flight enquiry not found") };
    };
  };

  // Visa Enquiries - Public submission (no auth required)
  public shared ({ caller }) func submitVisaEnquiry(input : VisaEnquiryInput) : async Nat {
    // No authorization check - anonymous submissions allowed
    let enquiry : VisaEnquiry = {
      id = nextVisaEnquiryId;
      customerName = input.customerName;
      customerPhone = input.customerPhone;
      customerEmail = input.customerEmail;
      country = input.country;
      visaType = input.visaType;
      travelDate = input.travelDate;
      passportNumber = input.passportNumber;
      specialNotes = input.specialNotes;
      status = "pending";
    };

    visaEnquiries.add(nextVisaEnquiryId, enquiry);
    nextVisaEnquiryId += 1;
    enquiry.id;
  };

  public query ({ caller }) func getAllVisaEnquiries(token : SessionToken) : async [(Nat, VisaEnquiry)] {
    requireAdminByToken(token);
    visaEnquiries.toArray();
  };

  public shared ({ caller }) func updateVisaEnquiryStatus(token : SessionToken, id : Nat, status : Text) : async () {
    requireAdminByToken(token);
    switch (visaEnquiries.get(id)) {
      case (?enquiry) {
        let updatedEnquiry = { enquiry with status };
        visaEnquiries.add(id, updatedEnquiry);
      };
      case (null) { Runtime.trap("Visa enquiry not found") };
    };
  };

  // Tour Enquiries - Public submission (no auth required)
  public shared ({ caller }) func submitTourEnquiry(input : TourEnquiryInput) : async Nat {
    // No authorization check - anonymous submissions allowed
    let enquiry : TourEnquiry = {
      id = nextTourEnquiryId;
      customerName = input.customerName;
      customerPhone = input.customerPhone;
      customerEmail = input.customerEmail;
      tourPackage = input.tourPackage;
      travelDate = input.travelDate;
      adultsCount = input.adultsCount;
      childrenCount = input.childrenCount;
      budget = input.budget;
      specialRequests = input.specialRequests;
      status = "pending";
    };

    tourEnquiries.add(nextTourEnquiryId, enquiry);
    nextTourEnquiryId += 1;
    enquiry.id;
  };

  public query ({ caller }) func getAllTourEnquiries(token : SessionToken) : async [(Nat, TourEnquiry)] {
    requireAdminByToken(token);
    tourEnquiries.toArray();
  };

  public shared ({ caller }) func updateTourEnquiryStatus(token : SessionToken, id : Nat, status : Text) : async () {
    requireAdminByToken(token);
    switch (tourEnquiries.get(id)) {
      case (?enquiry) {
        let updatedEnquiry = { enquiry with status };
        tourEnquiries.add(id, updatedEnquiry);
      };
      case (null) { Runtime.trap("Tour enquiry not found") };
    };
  };

  // PNR Enquiries - Public submission (no auth required)
  public shared ({ caller }) func submitPNREnquiry(input : PNREnquiryInput) : async Nat {
    // No authorization check - anonymous submissions allowed
    let enquiry : PNREnquiry = {
      id = nextPNREnquiryId;
      customerName = input.customerName;
      customerPhone = input.customerPhone;
      customerEmail = input.customerEmail;
      pnrNumber = input.pnrNumber;
      airline = input.airline;
      travelDate = input.travelDate;
      notes = input.notes;
    };

    pnrEnquiries.add(nextPNREnquiryId, enquiry);
    nextPNREnquiryId += 1;
    enquiry.id;
  };

  public query ({ caller }) func getAllPNREnquiries(token : SessionToken) : async [(Nat, PNREnquiry)] {
    requireAdminByToken(token);
    pnrEnquiries.toArray();
  };

  // Admin Stats - Admin only
  public query ({ caller }) func getAdminStats(token : SessionToken) : async AdminStats {
    requireAdminByToken(token);
    {
      totalFlightEnquiries = flightEnquiries.size();
      totalVisaEnquiries = visaEnquiries.size();
      totalTourEnquiries = tourEnquiries.size();
      totalPNREnquiries = pnrEnquiries.size();
      totalUsers = users.size();
    };
  };
};
