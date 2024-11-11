const app = angular.module('app', ['ui.router','ui.bootstrap']);
var baseUrl = 'https://10.21.98.164:8888';

// var options = {
//     "key": "YOUR_KEY_ID",
//     "amount": "2000", // 2000 paise = INR 20
//     "name": "VitalCure",
//     "handler": function (response){
//         alert(response.razorpay_payment_id);
//         // do an ajax call to backend and capture and verify the payment then 
//           //redirect to payment success page.
//     },
//     "theme": {
//         "color": "#F37254"
//     }
// };
// var rzp1 = new Razorpay(options);

// document.getElementById('rzp-button1').onclick = function(e){
//     rzp1.open();
//     e.preventDefault();
// }

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

app.service("api_request", ["$http", "$state", function($http, $state) {
    
    this.get_withdata = function(path, callback) {
        var req = {
            method: 'GET',
            url: `${baseUrl}/${path}`,
            withCredentials: true
        };
        $http(req).then(function(response) {
            callback(response.data);
        }, function(err) {
            console.log("Error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.data.error || "An unexpected error occurred. Please try again!"
            });
        });
    };

    this.post_withdata = function(path, data, callback) {
        var req = {
            method: 'POST',
            url: `${baseUrl}/${path}`,
            data: data,
            withCredentials: true
        };
        $http(req).then(function(response) {
            callback(response.data);
        }, function(err) {
            console.log("Error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.data.error || "An unexpected error occurred. Please try again!"
            });
        });
    };

    this.patch_withdata = function(path, data, callback) {
        var req = {
            method: 'PATCH',
            url: `${baseUrl}/${path}`,
            data: data,
            withCredentials: true
        };
        $http(req).then(function(response) {
            callback(response.data);
        }, function(err) {
            console.log("Error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.data.error || "An unexpected error occurred. Please try again!"
            });
        });
    };
}]);

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

app.controller('pRegController', ['$http', '$state', 'api_request', function ($http, $state, api_request) {
    var pRegCtrl = this;
    pRegCtrl.bgs=[];

    pRegCtrl.img = function(element) {
        pRegCtrl.image = element.files[0];
    };

    pRegCtrl.fetchbgs = function() {
        api_request.get_withdata('vitalcure/list_bg/', function(response) {
            pRegCtrl.bgs = response.list;
        });
    };
    
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

app.controller('docRegController', ['$http', '$state','api_request', function ($http, $state, api_request) {
    var docRegCtrl = this;
    docRegCtrl.specialists = [];

    docRegCtrl.img = function(element) {
        docRegCtrl.image = element.files[0];
    };

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
            console.log("error", error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.data.error || "An unexpected error occurred. PLease try again!!!"
            });
        });
    };

    docRegCtrl.fetchSpecialization = function() {
        api_request.get_withdata('vitalcure/list_specialisation/', function(response) {
            docRegCtrl.specialists = response.list;
        });
    };

    docRegCtrl.fetchSpecialization();
}]);

app.controller('appointController', ['$http', '$state','api_request', function($http,api_request) {
    var appointCtrl = this;
    appointCtrl.specialists = [];
    appointCtrl.doctors = [];

    appointCtrl.fetchSpecialization = function() {
        api_request.get_withdata('vitalcure/list_specialisation/', function(response) {
            appointCtrl.specialists = response.list;
        });
    };

    appointCtrl.appointment = function() {
        api_request.post_withdata('vitalcure/appointment_schedule/', {
            "doctor_selected": appointCtrl.doc,
            "reason": appointCtrl.reason,
            "symptoms": appointCtrl.symptom,
            "speciality": appointCtrl.specialist,
            "preferred_date": appointCtrl.date
        }, function(response) {
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.message
            })
            appointCtrl.resetForm();
        });
    };

    appointCtrl.fetchDocs = function(specialist) {
        api_request.post_withdata('vitalcure/spec_doctor/', {
            "specialisation": specialist
        }, function(response) {
            appointCtrl.doctors = response.list;
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

app.controller('LoginController',['$http', '$state','api_request', function ($http, $state,api_request) {
    var loginCtrl = this;
    loginCtrl.email = '';
    loginCtrl.password = '';

    loginCtrl.login = function() {
        api_request.post_withdata('vitalcure/login_user/', {
            "email": loginCtrl.email,
            "password": loginCtrl.password
        }, function(response) {
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.message
            }).then(() => {
                $state.go('user');
            });
        });
    };
    loginCtrl.checkSession = function() {
        api_request.get_withdata('vitalcure/login_user/', function(response) {
            console.log("Session check:", response);
            $state.go(response.url);
        });
    };

    loginCtrl.checkSession();
}]);

app.controller('LandingController', ['$http', 'api_request', function($http, api_request) {
    var landingCtrl = this;
    landingCtrl.details = [];

    landingCtrl.getImageUrl = function(imagePath) {
        return baseUrl + '/media/' + imagePath;
    };

    landingCtrl.fetchDoctors = function() {
        api_request.get_withdata('vitalcure/list_doctors/', function(response) {
            landingCtrl.details = response.details;
        });
    };

    landingCtrl.fetchDoctors();
}]);

app.controller('docController', ['$http', 'api_request', function($http, api_request) {
    var docCtrl = this;
    docCtrl.details = [];

    docCtrl.getImageUrl = function(imagePath) {
        return baseUrl + '/media/' + imagePath;
    };

    docCtrl.fetchDoctors = function() {
        api_request.get_withdata('vitalcure/list_doctors/', function(response) {
            docCtrl.details = response.details;
        });
    };

    docCtrl.fetchDoctors();
}]);

app.controller('allController', ['$http', 'api_request', function($http, api_request) {
    var allCtrl = this;
    allCtrl.details = [];

    allCtrl.getImageUrl = function(imagePath) {
        return baseUrl + '/media/' + imagePath;
    };

    allCtrl.fetchPatients = function() {
        api_request.get_withdata('vitalcure/list_patients/', function(response) {
            allCtrl.details = response.details;
        });
    };

    allCtrl.fetchPatients();
}]);

app.controller('userController', ['$http', '$state', 'api_request', function($http, $state, api_request) {
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
                api_request.get_withdata('vitalcure/logout_user/', function(response) {
                    console.log(response);
                    Swal.fire(
                        'Logged Out!',
                        'You have been successfully logged out.',
                        'success'
                    ).then(() => {
                        $state.go('landing');
                    });
                });
            }
        });
    };

    userCtrl.fetchNav = function() {
        api_request.get_withdata('vitalcure/view_panel/', function(response) {
            console.log("Navbar elements:", response);
            userCtrl.navs = response.panel;
            userCtrl.details = response.details;
        });
    };

    $state.go('user.dashboard');
    userCtrl.fetchNav();
}]);

app.controller('dashController',['$http','api_request', function($http,api_request) {
    var dashCtrl = this;
    dashCtrl.stats = {};
    dashCtrl.pres=[];

    dashCtrl.fetchDashboardStats = function() {
        api_request.get_withdata('vitalcure/stats/', function(response) {
            console.log("Dashboard stats:", response);
            if (response.details && response.details.length > 0) {
                dashCtrl.stats = response.details[0];
                dashCtrl.pres = response.details;
                dashCtrl.renderAppointmentChart();
                dashCtrl.renderRegistrationChart();
            } else {
                console.log("No data available in the response");
            }
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

app.controller('profileController', ['$http', 'api_request', function($http, api_request) {
    var profileCtrl = this;
    profileCtrl.users = [];

    profileCtrl.fetchUserProfile = function() {
        api_request.get_withdata('vitalcure/profile_details/', function(response) {
            console.log("User profile:", response);
            profileCtrl.users = response.profile;
        });
    };

    profileCtrl.fetchUserProfile();
}]);

app.controller('statusController', ['$http', 'api_request', function($http, api_request) {
    var statusCtrl = this;
    statusCtrl.appointments = [];
    statusCtrl.details = [];
    statusCtrl.role = {};

    statusCtrl.fetchAppointments = function() {
        api_request.get_withdata('vitalcure/list_appoint/', function(response) {
            console.log(response);
            statusCtrl.appointments = response.list;
            statusCtrl.role = response.role;
        });
    };

    statusCtrl.approve = function(appointment) {
        api_request.patch_withdata('vitalcure/approve_status/', {
            "id": appointment.id
        }, function(response) {
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.message
            });
            statusCtrl.fetchAppointments();
        });
    };

    statusCtrl.reject = function(appointmentId) {
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
                api_request.patch_withdata('vitalcure/reject_appoint/', {
                    "id": appointmentId,
                    "remark": result.value
                }, function(response) {
                    console.log(response);
                    Swal.fire({
                        icon: 'success',
                        text: response.message
                    });
                    statusCtrl.fetchAppointments();
                });
            }
        });
    };

    statusCtrl.fetchAppointments();
}]);

app.controller('patientController', ['$http','api_request', function($http,api_request) {
    var patientCtrl = this;
    patientCtrl.patients = [];
    patientCtrl.pres = [];
    patientCtrl.selectedPatient = {};
    patientCtrl.prescription = {};

    patientCtrl.fetchAppointments = function() {
        api_request.get_withdata('vitalcure/doc_pat/', function(response) {
            console.log("Appointments:", response);
            patientCtrl.patients = response.details;
        });
    };

    patientCtrl.viewPrescriptionModal = function(patient) {
        patientCtrl.selectedPatient = patient;
        api_request.post_withdata('vitalcure/list_doc_pres/', {
            "appointment_id": patient.id
        }, function(response) {
            patientCtrl.pres = response.list;
            var viewPrescriptionModal = new bootstrap.Modal(document.getElementById('viewPrescriptionModal'));
            viewPrescriptionModal.show();
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
            console.log("Prescription submitted:", response);
            Swal.fire({
                icon: 'success',
                text: response.data.message
            });
            var prescriptionModal = bootstrap.Modal.getInstance(document.getElementById('prescriptionModal'));
            patientCtrl.fetchAppointments(); 
            prescriptionModal.hide();
        }, function(error) {
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

app.controller('recordController', ['$http','api_request', function($http,api_request) {
    var recordCtrl = this;
    recordCtrl.all = [];
    recordCtrl.role = {};
    recordCtrl.searchQuery = '';
    recordCtrl.searchResults = [];

    recordCtrl.fetchAll = function() {
        api_request.get_withdata('vitalcure/records/', function(response) {
            recordCtrl.all = response.details;
            recordCtrl.role = response.role;
            recordCtrl.search();
        });
    };

    recordCtrl.deleteAppointment = function(patientId) {
        if (confirm('Are you sure you want to delete this appointment?')) {
            api_request.patch_withdata('vitalcure/delete_appointment/', {
                "id": patientId,
            }, function(response) {
                console.log(response);
                Swal.fire({
                    icon: 'success',
                    text: response.message
                });
                recordCtrl.fetchAll();
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

app.controller('presController', ['$http','$window','api_request', function($http,$window,api_request) {
    var presCtrl = this;
    presCtrl.pres = [];

    presCtrl.fetchPrescriptions = function() {
        api_request.get_withdata('vitalcure/list_pres/', function(response) {
            presCtrl.pres = response.data.list;
        });
    };

    presCtrl.printRecords = function() {
        $window.print();
    };

    presCtrl.fetchPrescriptions();

}]); 




