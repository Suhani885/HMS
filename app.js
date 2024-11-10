const app = angular.module('app', ['ui.router','ui.bootstrap']);
var baseUrl = 'https://10.21.98.200:8888';

app.service('loaderService', function() {
    this.isLoading = false;
    
    this.show = function() {
        console.log('Showing loader');
        this.isLoading = true;
    };
    
    this.hide = function() {
        console.log('Hiding loader');
        this.isLoading = false;
    };
});

app.directive('loader', function() {
    return {
        restrict: 'E',
        scope: {}, 
        template: '<div ng-show="loader.loaderService.isLoading" class="simple-loader">Loading...</div>',
        controller: function(loaderService) {
            this.loaderService = loaderService;
        },
        controllerAs: 'loader',
        bindToController: true
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
            templateUrl: 'templateFiles/nav.html',
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
            templateUrl: 'templateFiles/bookAppointment.html',
            controller: 'appointController',
            controllerAs: 'appointCtrl'
        })
        .state('user.patient', {
            url: '/patientDetails',
            templateUrl: 'templateFiles/patient.html',
            controller: 'patientController',
            controllerAs: 'patientCtrl'
        })
        .state('user.doctors', {
            url: '/doctorDetails',
            templateUrl: 'templateFiles/allDoctors.html',
            controller: 'docController',
            controllerAs: 'docCtrl'
        })
        .state('user.allPatients', {
            url: '/patientDetails',
            templateUrl: 'templateFiles/allPatients.html',
            controller: 'allController',
            controllerAs: 'allCtrl'
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
        .state('user.prescription', {
            url: '/prescription',
            templateUrl: 'templateFiles/prescription.html',
            controller: 'presController',
            controllerAs: 'presCtrl'
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
    pRegCtrl.bgs=[];

    pRegCtrl.img = function(element) {
        pRegCtrl.image = element.files[0];
    };

    pRegCtrl.fetchbgs = function() {
        $http.get(`${baseUrl}/vitalcure/list_bg/`)
            .then(function(response) {
                pRegCtrl.bgs = response.data.list;
            }, function(error) {
                console.log("Error fetching specializations:", error);
            });
    };

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
        var formData = new FormData();
        formData.append('first_name', pRegCtrl.fname);
        formData.append('last_name', pRegCtrl.lname);
        formData.append('email', pRegCtrl.email);
        formData.append('phone_number', pRegCtrl.number);
        formData.append('date_of_birth', pRegCtrl.dob);
        formData.append('age', pRegCtrl.age);
        formData.append('blood_group', pRegCtrl.bloodgrp);
        formData.append('address', pRegCtrl.address);
        formData.append('gender', pRegCtrl.gender);
        formData.append('height', pRegCtrl.height);
        formData.append('weight', pRegCtrl.weight);
        formData.append('medical_history', pRegCtrl.med);
        formData.append('password', pRegCtrl.pass1);
        formData.append('cpassword', pRegCtrl.pass2);
        formData.append('image', pRegCtrl.image);
        formData.set('last_name', pRegCtrl.lname || '');
        formData.set('medical_history', pRegCtrl.med || '');
    
        var req = {
            method: 'POST',
            url: `${baseUrl}/vitalcure/patient_register/`,
            headers: {'Content-Type': undefined},
            data: formData,
            withCredentials: true
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
            loaderService.hide();
            console.log("error", error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.data.error || "An unexpected error occurred. PLease try again!!!"
            });
        });
    };

    pRegCtrl.fetchbgs();
}]);

app.controller('docRegController', ['$http', '$state','loaderService', function ($http, $state, loaderService) {
    var docRegCtrl = this;
    docRegCtrl.specialists = [];

    docRegCtrl.img = function(element) {
        docRegCtrl.image = element.files[0];
    };

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
        var formData = new FormData();
        formData.append('first_name', docRegCtrl.fname);
        formData.append('last_name', docRegCtrl.lname);
        formData.append('email', docRegCtrl.email);
        formData.append('phone_number', docRegCtrl.number);
        formData.append('specialist', docRegCtrl.specialist);
        formData.append('age', docRegCtrl.age);
        formData.append('experience', docRegCtrl.exp);
        formData.append('qualification', docRegCtrl.qualify);
        formData.append('gender', docRegCtrl.gender);
        formData.append('consultation_fee', docRegCtrl.fee);
        formData.append('password', docRegCtrl.pass1);
        formData.append('cpassword', docRegCtrl.pass2);
        formData.append('image', docRegCtrl.image);
        formData.set('last_name', docRegCtrl.lname || '');
    
        var req = {
            method: 'POST',
            url: `${baseUrl}/vitalcure/doctor_register/`,
            headers: {'Content-Type': undefined},
            data: formData,
            withCredentials: true
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

app.controller('appointController', ['$http', '$state', function($http) {
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
    };

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
            })
            appointCtrl.resetForm();
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
        var req = {
            method: 'POST',
            url: `${baseUrl}/vitalcure/spec_doctor/`,
            data: {
                "specialisation": specialist
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

    appointCtrl.resetForm = function() {
        appointCtrl.doc = '';
        appointCtrl.reason = '';
        appointCtrl.symptom = '';
        appointCtrl.specialist = '';
        appointCtrl.date = null;
        appointCtrl.doctors = [];
    };

    appointCtrl.fetchSpecialization();
}]);

app.controller('LoginController',['$http', '$state','loaderService', function ($http, $state,loaderService) {
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
    loginCtrl.checkSession = function() {
        var req = {
            method: 'GET',
            url: `${baseUrl}/vitalcure/login_user/`,
            withCredentials: true
        };

        $http(req).then(function(response) {
            console.log("Session check:", response);
            route=response.data.url;
        }, function(error) {
            console.log("Session check failed", error);
        });
    };
    loginCtrl.checkSession();
}]);

app.controller('LandingController', ['$http', 'loaderService', function ($http,loaderService) {
    var landingCtrl = this;
    landingCtrl.details = [];

    landingCtrl.getImageUrl = function(imagePath) {
        return baseUrl + '/media/' + imagePath;
    };

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

    landingCtrl.fetchDoctors();
}]);

app.controller('docController', ['$http', 'loaderService', function ($http,loaderService) {
    var docCtrl = this;
    docCtrl.details = [];

    docCtrl.getImageUrl = function(imagePath) {
        return baseUrl + '/media/' + imagePath;
    };

    docCtrl.fetchDoctors = function() {
        loaderService.show();
        $http.get(`${baseUrl}/vitalcure/list_doctors/`)
            .then(function(response) {
                loaderService.hide();
                docCtrl.details = response.data.details;
            }, function(error) {
                loaderService.hide();
                console.log("Error fetching doctors:", error);
            });
    };

    docCtrl.fetchDoctors();
}]);

app.controller('allController', ['$http', 'loaderService', function ($http,loaderService) {
    var allCtrl = this;
    allCtrl.details = [];

    allCtrl.getImageUrl = function(imagePath) {
        return baseUrl + '/media/' + imagePath;
    };

    allCtrl.fetchPatients = function() {
        loaderService.show();
        $http.get(`${baseUrl}/vitalcure/list_patients/`)
            .then(function(response) {
                loaderService.hide();
                allCtrl.details = response.data.details;
            }, function(error) {
                loaderService.hide();
                console.log("Error fetching doctors:", error);
            });
    };

    allCtrl.fetchPatients();
}]);

app.controller('userController', ['$http', '$state', 'loaderService', function ($http, $state, loaderService) {
    var userCtrl = this;
    userCtrl.navs = [];
    userCtrl.details = [];

    userCtrl.getImageUrl = function(imagePath) {
        return baseUrl + '/media/' + imagePath;
    };

    userCtrl.isActive = function(url) {
        return $state.current.name === 'user.' + url;
    };

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
            userCtrl.navs = response.data.panel;
            userCtrl.details = response.data.details;
        }, function(error) {
            loaderService.hide();
            console.log("Error", error);
        });
    };

    $state.go('user.dashboard');
    userCtrl.fetchNav();
}]);

app.controller('dashController',['$http','loaderService', function($http,loaderService) {
    var dashCtrl = this;
    dashCtrl.stats = {};
    dashCtrl.pres=[];

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
                dashCtrl.pres = response.data.details;
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

app.controller('profileController', ['$http','loaderService', function($http,loaderService) {
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

app.controller('statusController', ['$http','loaderService', function($http,loaderService) {
    var statusCtrl = this;
    statusCtrl.appointments = [];
    statusCtrl.details = [];
    statusCtrl.role={};

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
            statusCtrl.role=response.data.role;
        }, function(error) {
            loaderService.hide();
            console.error('Error fetching appointments:', error);
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

    statusCtrl.fetchAppointments();
}]);

app.controller('patientController', ['$http','loaderService', function($http,loaderService) {
    var patientCtrl = this;
    patientCtrl.patients = [];
    patientCtrl.pres = [];
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
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Failed to fetch appointments. Please try again."
            });
        });
    };

    patientCtrl.viewPrescriptionModal = function(patient) {
        patientCtrl.selectedPatient = patient;
        loaderService.show();
        var req = {
            method: 'POST',
            url: `${baseUrl}/vitalcure/list_doc_pres/`,
            data: {
                "appointment_id": patient.id
            },
            withCredentials: true
        };
        $http(req).then(function(response) {
            loaderService.hide();
            patientCtrl.pres = response.data.list;
            var viewPrescriptionModal = new bootstrap.Modal(document.getElementById('viewPrescriptionModal'));
            viewPrescriptionModal.show();
        }, function(error) {
            loaderService.hide();
            console.log("error", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Failed to fetch prescription. Please try again."
            });
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
            "appointment_id": patientCtrl.selectedPatient.id,
            "diagnosis": patientCtrl.prescription.diagnosis,
            "medicine": patientCtrl.prescription.medicines.map(m => m.name),
            "day": patientCtrl.prescription.medicines.map(m => m.days),
            "dosage": patientCtrl.prescription.medicines.map(m => m.dosage),
            "instruction": patientCtrl.prescription.instructions
        };
        var req = {
            method: 'POST',
            url: `${baseUrl}/vitalcure/create_pres/`,
            data: prescriptionData,
            withCredentials: true
        };
        $http(req).then(function(response) {
            loaderService.hide();
            console.log("Prescription submitted:", response);
            Swal.fire({
                icon: 'success',
                text: response.data.message
            });
            var prescriptionModal = bootstrap.Modal.getInstance(document.getElementById('prescriptionModal'));
            prescriptionModal.hide();
            patientCtrl.fetchAppointments(); 
        }, function(error) {
            loaderService.hide();
            console.log("Error submitting prescription", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.data.error || "An unexpected error occurred!"
            });
        });
    };

    patientCtrl.fetchAppointments();
}]);

app.controller('recordController', ['$http', function($http) {
    var recordCtrl = this;
    recordCtrl.all = [];
    recordCtrl.role = {};
    recordCtrl.searchQuery = '';
    recordCtrl.searchResults = [];

    recordCtrl.fetchAll = function() {
        var req = {
            method: 'GET',
            url: `${baseUrl}/vitalcure/records/`,
            withCredentials: true
        };
        $http(req).then(function(response) {
            recordCtrl.all = response.data.details;
            recordCtrl.role = response.data.role;
            recordCtrl.search();
        }, function(error) {
            console.error('Error fetching records:', error);
        });
    };

    recordCtrl.deleteAppointment = function(patientId) {
        if (confirm('Are you sure you want to delete this appointment?')) {
            var req = {
                method: 'PATCH',
                url: `${baseUrl}/vitalcure/delete_appointment/`,
                data: {
                    "id": patientId,
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
                recordCtrl.fetchAll();
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

    recordCtrl.exportToExcel = function() {
        var data = recordCtrl.all;
        var htmlContent = '<table><tr><th>ID</th><th>Patient Name</th><th>Email</th><th>Doctor</th><th>Appointment Date</th><th>Reason</th><th>Status</th></tr>';

        data.forEach(function(patient) {
            htmlContent += '<tr>';
            htmlContent += `<td>${patient.id}</td>`;
            htmlContent += `<td>${patient.name}</td>`;
            htmlContent += `<td>${patient.email}</td>`;
            htmlContent += `<td>${patient.doctor || ''}</td>`;
            htmlContent += `<td>${new Date(patient.preferred_date).toLocaleDateString()}</td>`;
            htmlContent += `<td>${patient.reason}</td>`;
            htmlContent += `<td>${patient.status}</td>`;
            htmlContent += '</tr>';
        });

        htmlContent += '</table>';

        var blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "patient_records.xls");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    recordCtrl.fetchAll();
}]);

app.controller('presController', ['$http','$window',function($http,$window) {
    var presCtrl = this;
    presCtrl.pres = [];

    presCtrl.fetchPrescriptions = function() {
        var req = {
            method: 'GET',
            url: `${baseUrl}/vitalcure/list_pres/`,
            withCredentials: true
        };
        $http(req).then(function(response) {
            presCtrl.pres = response.data.list;
        }, function(error) {
            console.error('Error fetching:', error);
        });
    };
    presCtrl.fetchPrescriptions();

    presCtrl.printRecords = function() {
        $window.print();
    };

}]); 

