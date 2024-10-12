const app = angular.module('app', ['ui.router','ui.bootstrap']);
var baseUrl = 'https://10.21.98.209:8888';
app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/landing');
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templateFiles/login.html',
            controller: 'LoginController',
            controllerAs: 'loginCtrl'
        })
        .state('landing', {
            url: '/landing',
            templateUrl: 'templateFiles/landing.html',
            controller: 'LandingController',
            controllerAs: 'landingCtrl'
        })
        .state('patientReg', {
            url: '/patientReg',
            templateUrl: 'templateFiles/patientReg.html',
            controller: 'pRegController',
            controllerAs: 'pRegCtrl'
        }) 
        .state('user', {
            url: '/user',
            templateUrl: 'templateFiles/user.html',
            controller: 'userController',
            controllerAs: 'userCtrl'
        })
        // .state('user.dashboard', {
        //     url: '/dashboard',
        //     templateUrl: 'templateFiles/dashboard.html',
        //     controller: 'dashController',
        //     controllerAs: 'dashCtrl'
        // })
        // .state('user.profile', {
        //     url: '/profile',
        //     templateUrl: 'templateFiles/profile.html',
        //     controller: 'profileController',
        //     controllerAs: 'profileCtrl'
        // })
        .state('appointment', {
            url: '/appointment',
            templateUrl: 'templateFiles/appointment.html',
            controller: 'appointController',
            controllerAs: 'appointCtrl'
        })
        .state('docReg', {
            url: '/docReg',
            templateUrl: 'templateFiles/docReg.html',
            controller: 'docRegController',
            controllerAs: 'docRegCtrl'
        });

}]);

app.controller('pRegController', ['$http', '$state', function ($http, $state) {
    var pRegCtrl = this;
    pRegCtrl.Register = function() {
        console.log(pRegCtrl.email,pRegCtrl.pass1, pRegCtrl.pass2);
        if (pRegCtrl.pass1 !== pRegCtrl.pass2) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Passwords do not match!!!"
            });
            return;
        }
        var req = {
            method: 'POST',
            url:`${baseUrl}/vitalcure/patient_register/`,
            data: {
                "first_name": pRegCtrl.fname,
                "last_name": pRegCtrl.lname,
                "email": pRegCtrl.email,
                "phone_number": pRegCtrl.number,
                "date_of_birth": pRegCtrl.dob,
                "age": pRegCtrl.age,
                "blood_group":pRegCtrl.bloodgrp,
                "address":pRegCtrl.address,
                "gender":pRegCtrl.gender,
                "height":pRegCtrl.height,
                "weight":pRegCtrl.weight,
                "medical_history":pRegCtrl.med,
                "password": pRegCtrl.pass1,
                "cpassword": pRegCtrl.pass2
            }
        };
        $http(req).then(function(response) {
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.data.message
            }).then(() => {
                $state.go('login');
            });
        }, function(error) {
            console.log("error", error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.data.error || "An unexpected error occurred. PLease try again!!!"
            });
        });
    };
}]);

app.controller('docRegController', ['$http', '$state', function ($http, $state) {
    var docRegCtrl = this;
    docRegCtrl.specialists = [];

    docRegCtrl.Register = function() {
        console.log(docRegCtrl.email,docRegCtrl.pass1, docRegCtrl.pass2);
        if (docRegCtrl.pass1 !== docRegCtrl.pass2) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Passwords do not match!!!"
            });
            return;
        }
        var req = {
            method: 'POST',
            url:`${baseUrl}/vitalcure/doctor_register/`,
            data: {
                "first_name": docRegCtrl.fname,
                "last_name": docRegCtrl.lname,
                "email": docRegCtrl.email,
                "phone_number": docRegCtrl.number,
                "age": docRegCtrl.age,
                "specialist":docRegCtrl.specialist,
                "experience":docRegCtrl.exp,
                "qualification":docRegCtrl.qualify,
                "consultation_fee":docRegCtrl.fee,
                "gender":docRegCtrl.gender,
                "password": docRegCtrl.pass1,
                "cpassword": docRegCtrl.pass2
            }
        };
        $http(req).then(function(response) {
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Doctor Registration successful'
            }).then(() => {
                $state.go('login');
            });
        }, function(error) {
            console.log("error", error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.data.error || "An unexpected error occurred. PLease try again!!!"
            });
        });
    };

    docRegCtrl.fetchSpecialization = function() {
        $http.get(`${baseUrl}/vitalcure/list_specialisation/`)
            .then(function(response) {
                docRegCtrl.specialists = response.data.list;
            }, function(error) {
                console.log("Error fetching doctors:", error);
            });
    };
    docRegCtrl.fetchSpecialization();
}]);

app.controller('appointController', ['$http', '$state', function($http, $state) {
    var appointCtrl = this;
    appointCtrl.specialists = [];
    appointCtrl.doctors = [];

    appointCtrl.fetchSpecialization = function() {
        $http.get(`${baseUrl}/vitalcure/list_specialisation/`)
            .then(function(response) {
                appointCtrl.specialists = response.data.list;
            }, function(error) {
                console.log("Error fetching specializations:", error);
            });
    }
    appointCtrl.fetchSpecialization();

    appointCtrl.appointment = function() {
        var req = {
            method: 'POST',
            url: `${baseUrl}/vitalcure/appointment_schedule/`,
            data: {
                "doctor_selected": appointCtrl.doc,
                "reason": appointCtrl.reason,
                "symptoms": appointCtrl.symptom,
                "speciality": appointCtrl.specialist,
                "preferred_date": appointCtrl.date
            }
        };
        $http(req).then(function(response) {
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.data.message
            }).then(() => {
                $state.go('patient');
            });
        }, function(error) {
            console.log("error", error);
            Swal.fire({
                icon: 'error',
                title: 'Appointment Scheduling Failed',
                text: error.data.error || "An unexpected error occurred. Please try again!"
            });
        });
    };

    appointCtrl.fetchDocs = function(specialist) {
        var req = {
            method: 'POST',
            url: `${baseUrl}/vitalcure/spec_doctor/`,
            data: {
                "specialisation": specialist.name
            },
            withCredentials: true
        };
        $http(req).then(function(response) {
            console.log(response);
            appointCtrl.doctors = response.data.list; 
        }, function(error) {
            console.error('Error fetching doctors:', error);
        });
    };
}]);

app.controller('LoginController', ['$http', '$state', function ($http, $state) {
    var loginCtrl = this;
    loginCtrl.email = '';
    loginCtrl.password = '';

    
        // loaderService.show();
        
        // login function ...
        // loaderService.hide();

    loginCtrl.login = function() {
        console.log(loginCtrl.email, loginCtrl.password);
        if (loginCtrl.email && loginCtrl.password) {
            var req = {
                method: 'POST',
                url: `${baseUrl}/vitalcure/login_user/`,
                withCredentials: true,
                headers: {
                    'Content-Type': "application/json"
                },
                data: {
                    "email": loginCtrl.email,
                    "password": loginCtrl.password
                }
            };

            $http(req).then(function(response) {
                console.log(response);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: response.data.message
                }).then(() => {
                    $state.go('user');
                });
            }, function(error) { 
                console.log("error", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: error.data.error
                });
            });
        } 
    };
    // loginCtrl.checkSession();
}]);

app.controller('LandingController', ['$http', '$state', function ($http, $state) {
    var landingCtrl = this;
    landingCtrl.details = [];

    landingCtrl.checkSession = function() {
        var req = {
            method: 'GET',
            url: `${baseUrl}/accounts/login/`,
            withCredentials: true
        };

        $http(req).then(function(response) {
            console.log("Session check:", response);
            if (response.data.message === "Doctor is already logged in") {
                $state.go('doctor');
            } else if (response.data.message === "Patient is already logged in") {
                $state.go('patient');
            } else if (response.data.message === "Receptionist is already logged in") {
                $state.go('recep');
            }
        }, function(error) {
            console.log("Session check failed", error);
        });
    };

    landingCtrl.fetchDoctors = function() {
        $http.get(`${baseUrl}/vitalcure/list_doctors/`)
            .then(function(response) {
                landingCtrl.details = response.data.details;
            }, function(error) {
                console.log("Error fetching doctors:", error);
            });
    };

    landingCtrl.checkSession();
    landingCtrl.fetchDoctors();
}]);

app.controller('userController', ['$http', function ($http) {
    var userCtrl = this;
    userCtrl.navs = [];
    userCtrl.details=[];
    
    userCtrl.fetchNav = function() {
        var req = {
            method: 'GET',
            url: `${baseUrl}/vitalcure/view_panel/`,
            withCredentials: true
        };
        $http(req).then(function(response) {
            console.log("Navbar elements:", response);
            userCtrl.navs=response.data.panel;
            userCtrl.details=response.data.details;
        }, function(error) {
            console.log("Error", error);
        });
    };

    userCtrl.fetchNav();
}]);




