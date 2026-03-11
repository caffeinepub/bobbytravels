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

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Outcall "http-outcalls/outcall";

actor {
  let adminEmail = "adityabholath@gmail.com";
  var nextUserId = 1;
  var nextFlightEnquiryId = 1;
  var nextVisaEnquiryId = 1;
  var nextTourEnquiryId = 1;
  var nextPNREnquiryId = 1;
  var nextBookingId = 1;

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
  // Map session token to userId for booking lookups
  let sessionToUserId = Map.empty<SessionToken, Nat>();

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

  // User Bookings
  public type UserBooking = {
    bookingId : Nat;
    userId : Nat;
    customerName : Text;
    customerEmail : Text;
    customerPhone : Text;
    origin : Text;
    destination : Text;
    departureDate : Text;
    returnDate : ?Text;
    tripType : Text;
    adultsCount : Nat;
    childrenCount : Nat;
    infantsCount : Nat;
    cabinClass : Text;
    pnrNumber : ?Text;
    paymentStatus : Text;
    bookingStatus : Text;
    amadeusFlightInfo : ?Text;
    createdAt : Int;
  };

  public type UserBookingInput = {
    customerName : Text;
    customerEmail : Text;
    customerPhone : Text;
    origin : Text;
    destination : Text;
    departureDate : Text;
    returnDate : ?Text;
    tripType : Text;
    adultsCount : Nat;
    childrenCount : Nat;
    infantsCount : Nat;
    cabinClass : Text;
  };

  let bookings = Map.empty<Nat, UserBooking>();

  public type AdminStats = {
    totalFlightEnquiries : Nat;
    totalVisaEnquiries : Nat;
    totalTourEnquiries : Nat;
    totalPNREnquiries : Nat;
    totalUsers : Nat;
    totalBookings : Nat;
  };

  func generateToken(email : Text) : SessionToken {
    let timestamp = Int.abs(Time.now());
    let toHash = email.concat(timestamp.toText());
    toHash;
  };

  func generatePrincipalFromEmail(email : Text) : Principal {
    let timestamp = Int.abs(Time.now());
    let uniqueString = email.concat(timestamp.toText());
    Principal.fromText(uniqueString # ".0");
  };

  // Include authorization component
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // HTTP transform function for outcalls
  public query func transform(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  // User Profile Management
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
    switch (usersByEmail.get(email)) {
      case (?_) { Runtime.trap("User with this email already exists") };
      case (null) {};
    };

    let isAdmin = email == adminEmail;
    let userPrincipal = generatePrincipalFromEmail(email);
    let userId = nextUserId;

    let user : User = {
      id = userId;
      email;
      passwordHash;
      name;
      phone;
      isAdmin;
    };

    users.add(userId, user);
    usersByEmail.add(email, userId);
    principalToUser.add(userPrincipal, userId);
    nextUserId += 1;

    let profile : UserProfile = {
      name = name;
      phone = phone;
      email = email;
    };
    userProfiles.add(userPrincipal, profile);

    if (isAdmin) {
      AccessControl.assignRole(accessControlState, userPrincipal, userPrincipal, #admin);
    } else {
      AccessControl.assignRole(accessControlState, userPrincipal, userPrincipal, #user);
    };

    let token = generateToken(email);
    sessions.add(token, userPrincipal);
    sessionToUserId.add(token, userId);
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
            sessionToUserId.add(token, userId);
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

  // ---- User Bookings ----

  public shared ({ caller }) func saveUserBooking(token : SessionToken, input : UserBookingInput) : async Nat {
    let userId = switch (sessionToUserId.get(token)) {
      case (?id) { id };
      case (null) { Runtime.trap("Invalid session token") };
    };
    let user = switch (users.get(userId)) {
      case (?u) { u };
      case (null) { Runtime.trap("User not found") };
    };
    let bookingId = nextBookingId;
    let booking : UserBooking = {
      bookingId;
      userId;
      customerName = input.customerName;
      customerEmail = input.customerEmail;
      customerPhone = input.customerPhone;
      origin = input.origin;
      destination = input.destination;
      departureDate = input.departureDate;
      returnDate = input.returnDate;
      tripType = input.tripType;
      adultsCount = input.adultsCount;
      childrenCount = input.childrenCount;
      infantsCount = input.infantsCount;
      cabinClass = input.cabinClass;
      pnrNumber = null;
      paymentStatus = "pending";
      bookingStatus = "enquiry";
      amadeusFlightInfo = null;
      createdAt = Time.now();
    };
    bookings.add(bookingId, booking);
    nextBookingId += 1;
    bookingId;
  };

  public query ({ caller }) func getUserBookings(token : SessionToken) : async [UserBooking] {
    let userId = switch (sessionToUserId.get(token)) {
      case (?id) { id };
      case (null) { Runtime.trap("Invalid session token") };
    };
    let result = List.empty<UserBooking>();
    for ((_, booking) in bookings.entries()) {
      if (booking.userId == userId) {
        result.add(booking);
      };
    };
    result.toArray();
  };

  public shared ({ caller }) func updateBookingPNR(token : SessionToken, bookingId : Nat, pnrNumber : Text) : async () {
    requireAdminByToken(token);
    switch (bookings.get(bookingId)) {
      case (?booking) {
        bookings.add(bookingId, { booking with pnrNumber = ?pnrNumber });
      };
      case (null) { Runtime.trap("Booking not found") };
    };
  };

  public shared ({ caller }) func updateBookingPaymentStatus(token : SessionToken, bookingId : Nat, paymentStatus : Text) : async () {
    requireAdminByToken(token);
    switch (bookings.get(bookingId)) {
      case (?booking) {
        bookings.add(bookingId, { booking with paymentStatus });
      };
      case (null) { Runtime.trap("Booking not found") };
    };
  };

  public shared ({ caller }) func updateBookingStatus(token : SessionToken, bookingId : Nat, bookingStatus : Text) : async () {
    requireAdminByToken(token);
    switch (bookings.get(bookingId)) {
      case (?booking) {
        bookings.add(bookingId, { booking with bookingStatus });
      };
      case (null) { Runtime.trap("Booking not found") };
    };
  };

  public query ({ caller }) func getAllBookings(token : SessionToken) : async [UserBooking] {
    requireAdminByToken(token);
    let result = List.empty<UserBooking>();
    for ((_, booking) in bookings.entries()) {
      result.add(booking);
    };
    result.toArray();
  };

  // Amadeus API - fetch flight info by PNR
  public shared ({ caller }) func getAmadeusFlightInfo(pnrNumber : Text, airline : Text) : async Text {
    // Step 1: Get OAuth token
    let tokenBody = "grant_type=client_credentials&client_id=IM89moTdjNpalJEL5SkCNis2C9vA3Pix&client_secret=nTy5ERnHp8kAUedf";
    let tokenHeaders : [Outcall.Header] = [{
      name = "Content-Type";
      value = "application/x-www-form-urlencoded";
    }];
    let tokenResponse = await Outcall.httpPostRequest(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      tokenHeaders,
      tokenBody,
      transform
    );
    // Return the raw token response for now (frontend can parse and use it)
    tokenResponse;
  };

  // Flight Enquiries
  public shared ({ caller }) func submitFlightEnquiry(input : FlightEnquiryInput) : async Nat {
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
        flightEnquiries.add(id, { enquiry with status });
      };
      case (null) { Runtime.trap("Flight enquiry not found") };
    };
  };

  // Visa Enquiries
  public shared ({ caller }) func submitVisaEnquiry(input : VisaEnquiryInput) : async Nat {
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
        visaEnquiries.add(id, { enquiry with status });
      };
      case (null) { Runtime.trap("Visa enquiry not found") };
    };
  };

  // Tour Enquiries
  public shared ({ caller }) func submitTourEnquiry(input : TourEnquiryInput) : async Nat {
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
        tourEnquiries.add(id, { enquiry with status });
      };
      case (null) { Runtime.trap("Tour enquiry not found") };
    };
  };

  // PNR Enquiries
  public shared ({ caller }) func submitPNREnquiry(input : PNREnquiryInput) : async Nat {
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

  // Admin Stats
  public query ({ caller }) func getAdminStats(token : SessionToken) : async AdminStats {
    requireAdminByToken(token);
    {
      totalFlightEnquiries = flightEnquiries.size();
      totalVisaEnquiries = visaEnquiries.size();
      totalTourEnquiries = tourEnquiries.size();
      totalPNREnquiries = pnrEnquiries.size();
      totalUsers = users.size();
      totalBookings = bookings.size();
    };
  };
};
