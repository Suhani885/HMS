app.config([
  "$urlRouterProvider",
  "$stateProvider",
  function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/landing");
    $stateProvider
      .state("login", {
        url: "/login",
        templateUrl: "templateFiles/login.html",
        controller: "LoginController",
        controllerAs: "loginCtrl",
      })
      .state("landing", {
        url: "/landing",
        templateUrl: "templateFiles/landing.html",
        controller: "LandingController",
        controllerAs: "landingCtrl",
      })
      .state("user", {
        url: "/user",
        templateUrl: "templateFiles/nav.html",
        controller: "userController",
        controllerAs: "userCtrl",
      })
      .state("user.dashboard", {
        url: "/dashboard",
        templateUrl: "templateFiles/dashboard.html",
        controller: "dashController",
        controllerAs: "dashCtrl",
      })
      .state("user.profile", {
        url: "/profile",
        templateUrl: "templateFiles/profile.html",
        controller: "profileController",
        controllerAs: "profileCtrl",
      })
      .state("user.appointment", {
        url: "/appointment",
        templateUrl: "templateFiles/scheduleAppointment.html",
        controller: "appointController",
        controllerAs: "appointCtrl",
      })
      .state("user.patient", {
        url: "/patientDetails",
        templateUrl: "templateFiles/appointments.html",
        controller: "patientController",
        controllerAs: "patientCtrl",
      })
      .state("user.doctors", {
        url: "/doctorDetails",
        templateUrl: "templateFiles/allDoctors.html",
        controller: "docController",
        controllerAs: "docCtrl",
      })
      .state("user.allPatients", {
        url: "/patientDetails",
        templateUrl: "templateFiles/allPatients.html",
        controller: "allController",
        controllerAs: "allCtrl",
      })
      .state("user.appoint", {
        url: "/appointmentStatus",
        templateUrl: "templateFiles/pendingAppointments.html",
        controller: "statusController",
        controllerAs: "statusCtrl",
      })
      .state("user.records", {
        url: "/records",
        templateUrl: "templateFiles/records.html",
        controller: "recordController",
        controllerAs: "recordCtrl",
      })
      .state("user.prescription", {
        url: "/prescription",
        templateUrl: "templateFiles/prescriptions.html",
        controller: "presController",
        controllerAs: "presCtrl",
      })
      .state("patientReg", {
        url: "/patientReg",
        templateUrl: "templateFiles/patientReg.html",
        controller: "pRegController",
        controllerAs: "pRegCtrl",
      })
      .state("docReg", {
        url: "/docReg",
        templateUrl: "templateFiles/doctorReg.html",
        controller: "docRegController",
        controllerAs: "docRegCtrl",
      });
  },
]);
