const app = angular.module('app', ['ui.router','ui.bootstrap']);
var baseUrl = 'https://10.21.96.23:8888';

app.service('loaderService', function() {
    this.isLoading = false;
    this.show = function() {
        this.isLoading = true;
    };
    this.hide = function() {
        this.isLoading = false;
    };
});

app.directive('loader', function() {
    return {
        restrict: 'E',
        template: '<div ng-show="loader.isLoading" class="simple-loader">Loading...</div>',
        controller: function(loaderService) {
            this.isLoading = loaderService.isLoading;
        },
        controllerAs: 'loader'
    };
});

app.run(function($rootScope, loaderService) {
    $rootScope.$on('$stateChangeStart', function() {
        loaderService.show();
    });
    $rootScope.$on('$stateChangeSuccess', function() {
        loaderService.hide();
    });
    $rootScope.$on('$stateChangeError', function() {
        loaderService.hide();
    });
});

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
        .state('user.dashboard', {
            url: '/dashboard',
            templateUrl: 'templateFiles/dashboard.html',
            controller: 'dashController',
            controllerAs: 'dashCtrl'
        })
        .state('user.profile', {
            url: '/profile',
            templateUrl: 'templateFiles/profile.html',
            controller: 'profileController',
            controllerAs: 'profileCtrl'
        })
        .state('user.appointment', {
            url: '/appointment',
            templateUrl: 'templateFiles/appointment.html',
            controller: 'appointController',
            controllerAs: 'appointCtrl'
        })
        .state('user.patient', {
            url: '/patientDetails',
            templateUrl: 'templateFiles/patient.html',
            controller: 'patientController',
            controllerAs: 'patientCtrl'
        })
        .state('user.appoint', {
            url: '/appointmentStatus',
            templateUrl: 'templateFiles/appointStatus.html',
            controller: 'statusController',
            controllerAs: 'statusCtrl'
        })
        .state('user.records', {
            url: '/records',
            templateUrl: 'templateFiles/record.html',
            controller: 'recordController',
            controllerAs: 'recordCtrl'
        })
        .state('docReg', {
            url: '/docReg',
            templateUrl: 'templateFiles/docReg.html',
            controller: 'docRegController',
            controllerAs: 'docRegCtrl'
        });

}]);

app.controller('pRegController', ['$http', '$state', 'loaderService', function ($http, $state, loaderService) {
    var pRegCtrl = this;
    pRegCtrl.Register = function() {
        loaderService.show();
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
            loaderService.hide();
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.data.message
            }).then(() => {
                $state.go('login');
            });
        }, function(error) {
            loaderService.hide();
            console.log("error", error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.data.error || "An unexpected error occurred. PLease try again!!!"
            });
        });
    };
}]);

app.controller('docRegController', ['$http', '$state','loaderService', function ($http, $state, loaderService) {
    var docRegCtrl = this;
    docRegCtrl.specialists = [];

    docRegCtrl.Register = function() {
        loaderService.show();
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
            loaderService.hide();
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Doctor Registration successful'
            }).then(() => {
                $state.go('login');
            });
        }, function(error) {
            loaderService.hide();
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
                loaderService.hide();
                docRegCtrl.specialists = response.data.list;
            }, function(error) {
                loaderService.hide();
                console.log("Error fetching doctors:", error);
            });
    };
    docRegCtrl.fetchSpecialization();
}]);

app.controller('appointController','loaderService', ['$http', '$state', function($http, $state,loaderService) {
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
        loaderService.show();
        var req = {
            method: 'POST',
            url: `${baseUrl}/vitalcure/appointment_schedule/`,
            data: {
                "doctor_selected": appointCtrl.doc,
                "reason": appointCtrl.reason,
                "symptoms": appointCtrl.symptom,
                "speciality": appointCtrl.specialist,
                "preferred_date": appointCtrl.date
            },
            withCredentials: true 
        };
        $http(req).then(function(response) {
            loaderService.hide();
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.data.message
            }).then(() => {
                appointCtrl.doc = '';
                appointCtrl.reason = '';
                appointCtrl.symptom = '';
                appointCtrl.specialist = '';
                appointCtrl.date = null;
                appointCtrl.doctors = [];
                $state.go('user.dashboard');
            });
        }, function(error) {
            loaderService.hide();
            console.log("error", error);
            Swal.fire({
                icon: 'error',
                title: 'Appointment Scheduling Failed',
                text: error.data.error || "An unexpected error occurred. Please try again!"
            });
        });
    };

    appointCtrl.fetchDocs = function(specialist) {
        loaderService.show();
        var req = {
            method: 'POST',
            url: `${baseUrl}/vitalcure/spec_doctor/`,
            data: {
                "specialisation": specialist
            },
            withCredentials: true
        };
        $http(req).then(function(response) {
            loaderService.hide();
            console.log(response);
            appointCtrl.doctors = response.data.list; 
        }, function(error) {
            loaderService.hide();
            console.error('Error fetching doctors:', error);
        });
    };
}]);

app.controller('LoginController','loaderService', ['$http', '$state', function ($http, $state,loaderService) {
    var loginCtrl = this;
    loginCtrl.email = '';
    loginCtrl.password = '';

    loginCtrl.login = function() {
        loaderService.show();
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
                loaderService.hide();
                console.log(response);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: response.data.message
                }).then(() => {
                    $state.go('user');
                });
            }, function(error) { 
                loaderService.hide();
                console.log("error", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: error.data.error
                });
            });
        } 
    };
    // loginCtrl.checkSession = function() {
    //     var req = {
    //         method: 'GET',
    //         url: `${baseUrl}/vitalcure/login_user/`,
    //         withCredentials: true
    //     };

    //     $http(req).then(function(response) {
    //         console.log("Session check:", response);
    //         if (response.data.message === "Doctor is already logged in") {
    //             $state.go('doctor');
    //         } else if (response.data.message === "Patient is already logged in") {
    //             $state.go('patient');
    //         } else if (response.data.message === "Receptionist is already logged in") {
    //             $state.go('recep');
    //         }
    //     }, function(error) {
    //         console.log("Session check failed", error);
    //     });
    // };
    // loginCtrl.checkSession();
}]);

app.controller('LandingController','loaderService', ['$http', '$state', function ($http, $state,loaderService) {
    var landingCtrl = this;
    landingCtrl.details = [];

    // landingCtrl.checkSession = function() {
    //     var req = {
    //         method: 'GET',
    //         url: `${baseUrl}/vitalcure/login_user/`,
    //         withCredentials: true
    //     };

    //     $http(req).then(function(response) {
    //         console.log("Session check:", response);
    //         if (response.data.message === "Doctor is already logged in") {
    //             $state.go('doctor');
    //         } else if (response.data.message === "Patient is already logged in") {
    //             $state.go('patient');
    //         } else if (response.data.message === "Receptionist is already logged in") {
    //             $state.go('recep');
    //         }
    //     }, function(error) {
    //         console.log("Session check failed", error);
    //     });
    // };

    landingCtrl.fetchDoctors = function() {
        loaderService.show();
        $http.get(`${baseUrl}/vitalcure/list_doctors/`)
            .then(function(response) {
                loaderService.hide();
                landingCtrl.details = response.data.details;
            }, function(error) {
                loaderService.hide();
                console.log("Error fetching doctors:", error);
            });
    };

    // landingCtrl.checkSession();
    landingCtrl.fetchDoctors();
}]);

app.controller('userController','loaderService', ['$http', '$state', function ($http, $state,loaderService) {
    var userCtrl = this;
    userCtrl.navs = [];
    userCtrl.details = [];

    userCtrl.logout = function() {
        loaderService.show();
        Swal.fire({
        title: 'Are you sure?',
        text: "You're about to log out!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, log out!'
        }).then((result) => {
        if (result.isConfirmed) {
        var req = {
            method: 'GET',
            url: `${baseUrl}/vitalcure/logout_user/`,
            withCredentials: true
        };
        $http(req).then(function(response) {
            loaderService.hide();
            console.log(response);
            Swal.fire(
                'Logged Out!',
                'You have been successfully logged out.',
                'success'
            ).then(() => {
                $state.go('landing');
            });
        }, function(error) {
            loaderService.hide();
            console.log("error", error);
            Swal.fire(
                'Error!',
                error.data.message || 'Failed to log out. Please try again!',
                'error'
            );
        });
        }
        });
        };
    
    userCtrl.fetchNav = function() {
        loaderService.show();
        var req = {
            method: 'GET',
            url: `${baseUrl}/vitalcure/view_panel/`,
            withCredentials: true
        };
        $http(req).then(function(response) {
            loaderService.hide();
            console.log("Navbar elements:", response);
            userCtrl.navs = response.data.panel.map(function(nav) {
                nav.isActive = $state.includes('user.' + nav.url);
                return nav;
            });
            userCtrl.details = response.data.details;
        }, function(error) {
            loaderService.hide();
            console.log("Error", error);
        });
    };

    $state.go('user.dashboard');  
    userCtrl.fetchNav();
}]);

app.controller('dashController','loaderService', ['$http', function($http,loaderService) {
    var dashCtrl = this;
    dashCtrl.stats = {};

    dashCtrl.fetchDashboardStats = function() {
        loaderService.show();
        var req = {
            method: 'GET',
            url: `${baseUrl}/vitalcure/stats/`,
            withCredentials: true
        };
        $http(req).then(function(response) {
            loaderService.hide();
            console.log("Dashboard stats:", response);
            if (response.data.details && response.data.details.length > 0) {
                dashCtrl.stats = response.data.details[0];
                dashCtrl.renderAppointmentChart();
                dashCtrl.renderRegistrationChart();
            } else {
                console.log("No data available in the response");
            }
        }, function(error) {
            loaderService.hide();
            console.log("Error fetching dashboard stats", error);
        });
    };

    dashCtrl.renderAppointmentChart = function() {
        var chart = new CanvasJS.Chart("appointmentChartContainer", {
            animationEnabled: true,
            title: {
                text: "Appointment Overview"
            },
            data: [{
                type: "pie",
                startAngle: 240,
                yValueFormatString: "##0",
                indexLabel: "{label} {y}",
                dataPoints: [
                    {y: dashCtrl.stats.appointment_accepted || 0, label: "Approved:"},
                    {y: dashCtrl.stats.appointment_rejected || 0, label: "Rejected:"},
                    {y: dashCtrl.stats.pending || 0, label: "Pending:"}
                ]
            }]
        });
        chart.render();
    };

    dashCtrl.renderRegistrationChart = function() {
        var chart = new CanvasJS.Chart("registrationChartContainer", {
            animationEnabled: true,
            title: {
                text: "Registration Overview"
            },
            data: [{
                type: "doughnut",
                startAngle: 60,
                innerRadius: 60,
                indexLabelFontSize: 17,
                indexLabel: "{label} - #percent%",
                toolTipContent: "<b>{label}:</b> {y} (#percent%)",
                dataPoints: [
                    {y: dashCtrl.stats.doctor_registered || 0, label: "Doctors"},
                    {y: dashCtrl.stats.patient_registered || 0, label: "Patients"}
                ]
            }]
        });
        chart.render();
    };

    dashCtrl.fetchDashboardStats();
}]);

app.controller('profileController','loaderService', ['$http', function($http,loaderService) {
    var profileCtrl = this;
    profileCtrl.users = [];

    profileCtrl.fetchUserProfile = function() {
        loaderService.show();
        var req = {
            method: 'GET',
            url: `${baseUrl}/vitalcure/profile_details/`,
            withCredentials: true
        };
        $http(req).then(function(response) {
            loaderService.hide();
            console.log("User profile:", response);
            profileCtrl.users = response.data.profile;
        }, function(error) {
            loaderService.hide();
            console.log("Error fetching user profile", error);
        });
    };

    profileCtrl.fetchUserProfile();
}]);

app.controller('statusController','loaderService', ['$http', function($http,loaderService) {
    var statusCtrl = this;
    statusCtrl.appointments = [];
    statusCtrl.details = [];

    statusCtrl.fetchAppointments = function() {
        loaderService.show();
        var req = {
            method: 'GET',
            url: `${baseUrl}/vitalcure/list_appoint/`,
            withCredentials: true
        };
        $http(req).then(function(response) {
            loaderService.hide();
            console.log(response);
            statusCtrl.appointments = response.data.list;
        }, function(error) {
            loaderService.hide();
            console.error('Error fetching appointments:', error);
        });
    };

    statusCtrl.fetchUserDetails = function() {
        loaderService.show();
        var req = {
            method: 'GET',
            url: `${baseUrl}/vitalcure/view_panel/`,
            withCredentials: true
        };
        $http(req).then(function(response) {
            loaderService.hide();
            console.log(response);
            statusCtrl.details = response.data.details;
        }, function(error) {
            loaderService.hide();
            console.error('Error fetching user details:', error);
        });
    };

    statusCtrl.approve = function(appointment) {
        loaderService.show();
        var req = {
            method: 'PATCH',
            url: `${baseUrl}/vitalcure/approve_status/`,
            data: {
                "id": appointment.id
            },
            withCredentials: true 
        };
        $http(req).then(function(response) {
            loaderService.hide();
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.data.message
            });
            statusCtrl.fetchAppointments();
        }, function(error) {
            loaderService.hide();
            console.log("error", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.data.error || "An unexpected error occurred!"
            });
        });
    };

    statusCtrl.reject = function(appointmentId) {
        loaderService.show();
        Swal.fire({
            title: 'Rejection Reason',
            input: 'text',
            inputLabel: 'Please provide a reason for rejection',
            inputPlaceholder: 'Enter your reason here...',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to provide a reason for rejection!'
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                var req = {
                    method: 'PATCH',
                    url: `${baseUrl}/vitalcure/reject_appoint/`,
                    data: {
                        "id": appointmentId,
                        "remark": result.value
                    },
                    withCredentials: true 
                };
                $http(req).then(function(response) {
                    loaderService.hide();
                    console.log(response);
                    Swal.fire({
                        icon: 'success',
                        text: response.data.message
                    });
                    statusCtrl.fetchAppointments(); 
                }, function(error) {
                    loaderService.hide();
                    console.log("error", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.data.error || "An unexpected error occurred!"
                    });
                });
            }
        });
    };

    statusCtrl.fetchUserDetails();
    statusCtrl.fetchAppointments();
}]);

app.controller('patientController','loaderService', ['$http', function($http,loaderService) {
    var patientCtrl = this;
    patientCtrl.patients = [];
    patientCtrl.selectedPatient = {};
    patientCtrl.prescription = {};

    patientCtrl.fetchAppointments = function() {
        loaderService.show();
        var req = {
            method: 'GET',
            url: `${baseUrl}/vitalcure/doc_pat/`,
            withCredentials: true
        };
        $http(req).then(function(response) {
            loaderService.hide();
            console.log("Appointments:", response);
            patientCtrl.patients = response.data.details;
        }, function(error) {
            loaderService.hide();
            console.log("Error fetching approved appointments", error);
        });
    };

    patientCtrl.openPrescriptionModal = function(patient) {
        patientCtrl.selectedPatient = patient;
        patientCtrl.prescription = {
            medicines: [{}],  
            diagnosis: '',
            instructions: ''
        };
        var prescriptionModal = new bootstrap.Modal(document.getElementById('prescriptionModal'));
        prescriptionModal.show();
    };

    patientCtrl.addMedicine = function() {
        patientCtrl.prescription.medicines.push({});
    };

    patientCtrl.submitPrescription = function() {
        loaderService.show();
        var prescriptionData = {
            "patient_id": patientCtrl.selectedPatient.id,
            "diagnosis": patientCtrl.prescription.diagnosis,
            "medicines": patientCtrl.prescription.medicines,
            "instructions": patientCtrl.prescription.instructions
        };
        var req = {
            method: 'POST',
            url: `${baseUrl}/vitalcure/prescription/`,
            data: prescriptionData,
            withCredentials: true
        };
        $http(req).then(function(response) {
            loaderService.hide();
            console.log("Prescription submitted:", response);
            var prescriptionModal = bootstrap.Modal.getInstance(document.getElementById('prescriptionModal'));
            prescriptionModal.hide();
        }, function(error) {
            loaderService.hide();
            console.log("Error submitting prescription", error);
        });
    };

    patientCtrl.fetchAppointments();
}]);

app.controller('recordController', ['$http','$window',function($http,$window) {
    var recordCtrl = this;
    recordCtrl.all = []; 
    recordCtrl.searchQuery = ''; 
    recordCtrl.searchResults = [];
    
    recordCtrl.fetchAll = function() {
        var req = {
            method: 'GET',
            url: `${baseUrl}/vitalcure/reports/`,
            withCredentials: true
        };
        $http(req).then(function(response) {
            recordCtrl.all = response.data.details;
            recordCtrl.search(); 
        }, function(error) {
            console.error('Error fetching products:', error);
        });
    };

    recordCtrl.search = function() {
        if (recordCtrl.searchQuery.length > 0) {
            recordCtrl.searchResults = recordCtrl.all.filter(function(patient) {
                return patient.name.toLowerCase().includes(recordCtrl.searchQuery.toLowerCase()) ||
                       (patient.doctor && patient.doctor.toLowerCase().includes(recordCtrl.searchQuery.toLowerCase()));
            });
        } else {
            recordCtrl.searchResults = []; 
        }
    };

    // <button id="btnExport" onclick="exportReportToExcel(this)">Export HTML Table</button>
    // function exportReportToExcel() {
    //     let table = document.getElementsByID("table");
    //     TableToExcel.convert(table[0], {
    //     name: `file.xlsx`,
    //     sheet: {
    //     name: 'Sheet 1'
    //     }
    //     });
    //     }

    recordCtrl.printRecords = function() {
        $window.print();
    };
    recordCtrl.fetchAll();
}]); 