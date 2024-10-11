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
        .state('patient', {
            url: '/patient',
            templateUrl: 'templateFiles/patient.html',
            controller: 'patientController',
            controllerAs: 'patientCtrl'
        })
        .state('appoint', {
            url: '/appointment',
            templateUrl: 'templateFiles/appointment.html',
            controller: 'appointController',
            controllerAs: 'appointCtrl'
        })
        .state('doctor', {
            url: '/doctor',
            templateUrl: 'templateFiles/doc.html',
            controller: 'doctorController',
            controllerAs: 'docCtrl'
        })
        .state('recep', {
            url: '/receptionist',
            templateUrl: 'templateFiles/recep.html',
            controller: 'receptionistController',
            controllerAs: 'recepCtrl'
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
}]);

app.controller('LoginController', ['$http', '$state', function ($http, $state) {
    var loginCtrl = this;
    loginCtrl.email = '';
    loginCtrl.password = '';
    
    // loginCtrl.checkSession = function() {
    //     var req = {
    //         method: 'GET',
    //         url: `${baseUrl}/accounts/login/`,
    //         withCredentials: true
    //     };

    //     $http(req).then(function(response) {
    //         console.log("Session check:", response);
    //         if (response.data.message === "Doctor is already logged in") {
    //             $state.go('doctor');
    //         } else if (response.data.message === "Patient is already logged in") {
    //             $state.go('patient');
    //         } else if (response.data.message === "Recep is already logged in") {
    //             $state.go('recep');
    //         }
    //     }, function(error) {
    //         console.log("Session check failed", error);
    //     });
    // };

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
                if (response.data.message === "Patient successfully logged in") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: response.data.message
                    }).then(() => {
                        $state.go('patient');
                    });
                } else if (response.data.message === "Receptionist successfully logged in") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: response.data.message
                    }).then(() => {
                        $state.go('recep');
                    });
                } else if (response.data.message === "Doctor successfully logged in") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: response.data.message
                    }).then(() => {
                        $state.go('doctor');
                    });
                } 
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

app.controller('doctorController', ['$http', function ($http) {
    var docCtrl = this;
    docCtrl.navs = [];
    docCtrl.details=[];
    
    docCtrl.fetchNav = function() {
        var req = {
            method: 'GET',
            url: `${baseUrl}/vitalcure/view_panel/`,
            withCredentials: true
        };
        $http(req).then(function(response) {
            console.log("Navbar elements:", response);
            docCtrl.navs=response.data.panel;
            docCtrl.details=response.data.details;
        }, function(error) {
            console.log("Error", error);
        });
    };

    docCtrl.fetchNav();
}]);

app.controller('receptionistController', ['$http', function ($http) {
    var recepCtrl = this;
    recepCtrl.navs = [];
    recepCtrl.details=[];
    
    recepCtrl.fetchNav = function() {
        var req = {
            method: 'GET',
            url: `${baseUrl}/vitalcure/view_panel/`,
            withCredentials: true
        };
        $http(req).then(function(response) {
            console.log("Navbar elements:", response);
            recepCtrl.navs=response.data.panel;
            recepCtrl.details=response.data.details;
        }, function(error) {
            console.log("Error", error);
        });
    };

    recepCtrl.fetchNav();
}]);

app.controller('patientController', ['$http', function ($http) {
    var patientCtrl = this;
    patientCtrl.navs = [];
    patientCtrl.details=[];
    
    patientCtrl.fetchNav = function() {
        var req = {
            method: 'GET',
            url: `${baseUrl}/vitalcure/view_panel/`,
            withCredentials: true
        };
        $http(req).then(function(response) {
            console.log("Navbar elements:", response);
            patientCtrl.navs=response.data.panel;
            patientCtrl.details=response.data.details;
        }, function(error) {
            console.log("Error", error);
        });
    };

    // patientCtrl.appointment = function() {
    //     var req = {
    //         method: 'POST',
    //         url:`${baseUrl}/vitalcure/p/`,
    //         data: {
    //             "doc_name": appCtrl.name,
    //             "last_name": pRegCtrl.lname,
    //             "email": pRegCtrl.email,
    //             "phone_number": pRegCtrl.number,
    //             "date_of_birth": pRegCtrl.dob,
    //             "age": pRegCtrl.age,
    //             "blood_group":pRegCtrl.bloodgrp,
    //             "address":pRegCtrl.address,
    //             "gender":pRegCtrl.gender,
    //             "height":pRegCtrl.height,
    //             "weight":pRegCtrl.weight,
    //             "medical_history":pRegCtrl.med,
    //             "password": pRegCtrl.pass1,
    //             "cpassword": pRegCtrl.pass2
    //         }
    //     };
    //     $http(req).then(function(response) {
    //         console.log(response);
    //         Swal.fire({
    //             icon: 'success',
    //             title: 'Success!',
    //             text: response.data.message
    //         }).then(() => {
    //             // $state.go('patient');
    //         });
    //     }, function(error) {
    //         console.log("error", error);
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Appointment Scheduling Failed',
    //             text: error.data.error || "An unexpected error occurred. PLease try again!!!"
    //         });
    //     });
    // };

    patientCtrl.fetchNav();
}]);

