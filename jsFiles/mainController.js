app.controller("LandingController", [
  "$http",
  "api_request",
  function ($http, api_request) {
    var landingCtrl = this;
    landingCtrl.details = [];

    landingCtrl.getImageUrl = function (imagePath) {
      return baseUrl + "/media/" + imagePath;
    };

    landingCtrl.fetchDoctors = function () {
      var req = {
        method: "GET",
        url: `${baseUrl}/vitalcure/list_doctors/`,
        withCredentials: true,
      };

      $http(req).then(
        function (response) {
          landingCtrl.details = response.data.details;
        },
        function (err) {
          console.log("Error:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.data.error || "Failed to load doctors. Please try again!",
          });
        }
      );
    };

    landingCtrl.fetchDoctors();
  },
]);

app.controller("userController", [
  "$http",
  "$state",
  "api_request",
  function ($http, $state, api_request) {
    var userCtrl = this;
    userCtrl.navs = [];
    userCtrl.details = [];

    userCtrl.getImageUrl = function (imagePath) {
      return baseUrl + "/media/" + imagePath;
    };

    userCtrl.isActive = function (url) {
      return $state.current.name === "user." + url;
    };

    userCtrl.logout = function () {
      Swal.fire({
        title: "Are you sure?",
        text: "You're about to log out!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, log out!",
      }).then((result) => {
        if (result.isConfirmed) {
          api_request.get_withdata(
            "vitalcure/logout_user/",
            function (response) {
              console.log(response);
              Swal.fire(
                "Logged Out!",
                "You have been successfully logged out.",
                "success"
              ).then(() => {
                $state.go("landing");
              });
            }
          );
        }
      });
    };

    userCtrl.fetchNav = function () {
      api_request.get_withdata("vitalcure/view_panel/", function (response) {
        console.log("Navbar elements:", response);
        userCtrl.navs = response.panel;
        userCtrl.details = response.details;
      });
    };

    $state.go("user.dashboard");
    userCtrl.fetchNav();
  },
]);

app.controller("allController", [
  "$http",
  "api_request",
  function ($http, api_request) {
    var allCtrl = this;
    allCtrl.details = [];

    allCtrl.getImageUrl = function (imagePath) {
      return baseUrl + "/media/" + imagePath;
    };

    allCtrl.fetchPatients = function () {
      api_request.get_withdata("vitalcure/list_patients/", function (response) {
        allCtrl.details = response.details;
      });
    };

    allCtrl.fetchPatients();
  },
]);

app.controller("docController", [
  "$http",
  "api_request",
  function ($http, api_request) {
    var docCtrl = this;
    docCtrl.details = [];

    docCtrl.getImageUrl = function (imagePath) {
      return baseUrl + "/media/" + imagePath;
    };

    docCtrl.fetchDoctors = function () {
      api_request.get_withdata("vitalcure/list_doctors/", function (response) {
        docCtrl.details = response.details;
      });
    };

    docCtrl.fetchDoctors();
  },
]);

app.controller("dashController", [
  "$http",
  "api_request",
  function ($http, api_request) {
    var dashCtrl = this;
    dashCtrl.stats = {};
    dashCtrl.pres = [];

    dashCtrl.fetchDashboardStats = function () {
      api_request.get_withdata("vitalcure/stats/", function (response) {
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

    dashCtrl.renderAppointmentChart = function () {
      var chart = new CanvasJS.Chart("appointmentChartContainer", {
        animationEnabled: true,
        title: {
          text: "Appointment Overview",
        },
        data: [
          {
            type: "pie",
            startAngle: 240,
            yValueFormatString: "##0",
            indexLabel: "{label} {y}",
            dataPoints: [
              {
                y: dashCtrl.stats.appointment_accepted || 0,
                label: "Approved:",
              },
              {
                y: dashCtrl.stats.appointment_rejected || 0,
                label: "Rejected:",
              },
              { y: dashCtrl.stats.pending || 0, label: "Pending:" },
            ],
          },
        ],
      });
      chart.render();
    };

    dashCtrl.renderRegistrationChart = function () {
      var chart = new CanvasJS.Chart("registrationChartContainer", {
        animationEnabled: true,
        title: {
          text: "Registration Overview",
        },
        data: [
          {
            type: "doughnut",
            startAngle: 60,
            innerRadius: 60,
            indexLabelFontSize: 17,
            indexLabel: "{label} - #percent%",
            toolTipContent: "<b>{label}:</b> {y} (#percent%)",
            dataPoints: [
              { y: dashCtrl.stats.doctor_registered || 0, label: "Doctors" },
              { y: dashCtrl.stats.patient_registered || 0, label: "Patients" },
            ],
          },
        ],
      });
      chart.render();
    };

    dashCtrl.fetchDashboardStats();
  },
]);

app.controller("profileController", [
  "$http",
  "api_request",
  function ($http, api_request) {
    var profileCtrl = this;
    profileCtrl.users = [];

    profileCtrl.fetchUserProfile = function () {
      api_request.get_withdata(
        "vitalcure/profile_details/",
        function (response) {
          console.log("User profile:", response);
          profileCtrl.users = response.profile;
        }
      );
    };

    profileCtrl.fetchUserProfile();
  },
]);

app.controller("statusController", [
  "$http",
  "api_request",
  function ($http, api_request) {
    var statusCtrl = this;
    statusCtrl.appointments = [];
    statusCtrl.details = [];
    statusCtrl.role = {};

    statusCtrl.fetchAppointments = function () {
      api_request.get_withdata("vitalcure/list_appoint/", function (response) {
        console.log(response);
        statusCtrl.appointments = response.list;
        statusCtrl.role = response.role;
      });
    };

    statusCtrl.approve = function (appointment) {
      api_request.patch_withdata(
        "vitalcure/approve_status/",
        {
          id: appointment.id,
        },
        function (response) {
          console.log(response);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: response.message,
          });
          statusCtrl.fetchAppointments();
        }
      );
    };

    statusCtrl.reject = function (appointmentId) {
      Swal.fire({
        title: "Rejection Reason",
        input: "text",
        inputLabel: "Please provide a reason for rejection",
        inputPlaceholder: "Enter your reason here...",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "You need to provide a reason for rejection!";
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          api_request.patch_withdata(
            "vitalcure/reject_appoint/",
            {
              id: appointmentId,
              remark: result.value,
            },
            function (response) {
              console.log(response);
              Swal.fire({
                icon: "success",
                text: response.message,
              });
              statusCtrl.fetchAppointments();
            }
          );
        }
      });
    };

    statusCtrl.fetchAppointments();
  },
]);

app.controller("appointController", [
  "$http",
  "$state",
  "api_request",
  function ($http, $state, api_request) {
    var appointCtrl = this;
    appointCtrl.specialists = [];
    appointCtrl.doctors = [];

    appointCtrl.fetchSpecialization = function () {
      api_request.get_withdata(
        "vitalcure/list_specialisation/",
        function (response) {
          appointCtrl.specialists = response.list;
        }
      );
    };

    appointCtrl.appointment = function () {
      api_request.post_withdata(
        "vitalcure/appointment_schedule/",
        {
          doctor_selected: appointCtrl.doc,
          reason: appointCtrl.reason,
          symptoms: appointCtrl.symptom,
          speciality: appointCtrl.specialist,
          preferred_date: appointCtrl.date,
        },
        function (response) {
          console.log(response);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: response.message,
          });
          appointCtrl.resetForm();
        }
      );
    };

    appointCtrl.fetchDocs = function (specialist) {
      api_request.post_withdata(
        "vitalcure/spec_doctor/",
        {
          specialisation: specialist,
        },
        function (response) {
          appointCtrl.doctors = response.list;
        }
      );
    };

    appointCtrl.resetForm = function () {
      appointCtrl.doc = "";
      appointCtrl.reason = "";
      appointCtrl.symptom = "";
      appointCtrl.specialist = "";
      appointCtrl.date = null;
      appointCtrl.doctors = [];
    };

    appointCtrl.fetchSpecialization();
  },
]);

app.controller("patientController", [
  "$http",
  "api_request",
  function ($http, api_request) {
    var patientCtrl = this;
    patientCtrl.patients = [];
    patientCtrl.pres = [];
    patientCtrl.selectedPatient = {};
    patientCtrl.prescription = {};

    patientCtrl.fetchAppointments = function () {
      api_request.get_withdata("vitalcure/doc_pat/", function (response) {
        console.log("Appointments:", response);
        patientCtrl.patients = response.details;
      });
    };

    patientCtrl.viewPrescriptionModal = function (patient) {
      patientCtrl.selectedPatient = patient;
      api_request.post_withdata(
        "vitalcure/list_doc_pres/",
        {
          appointment_id: patient.id,
        },
        function (response) {
          patientCtrl.pres = response.list;
          var viewPrescriptionModal = new bootstrap.Modal(
            document.getElementById("viewPrescriptionModal")
          );
          viewPrescriptionModal.show();
        }
      );
    };

    patientCtrl.openPrescriptionModal = function (patient) {
      patientCtrl.selectedPatient = patient;
      patientCtrl.prescription = {
        medicines: [{}],
        diagnosis: "",
        instructions: "",
      };
      var prescriptionModal = new bootstrap.Modal(
        document.getElementById("prescriptionModal")
      );
      prescriptionModal.show();
    };

    patientCtrl.addMedicine = function () {
      patientCtrl.prescription.medicines.push({});
    };

    patientCtrl.submitPrescription = function () {
      var prescriptionData = {
        appointment_id: patientCtrl.selectedPatient.id,
        diagnosis: patientCtrl.prescription.diagnosis,
        medicine: patientCtrl.prescription.medicines.map((m) => m.name),
        day: patientCtrl.prescription.medicines.map((m) => m.days),
        dosage: patientCtrl.prescription.medicines.map((m) => m.dosage),
        instruction: patientCtrl.prescription.instructions,
      };
      var req = {
        method: "POST",
        url: `${baseUrl}/vitalcure/create_pres/`,
        data: prescriptionData,
        withCredentials: true,
      };
      $http(req).then(
        function (response) {
          console.log("Prescription submitted:", response);
          Swal.fire({
            icon: "success",
            text: response.data.message,
          });
          var prescriptionModal = bootstrap.Modal.getInstance(
            document.getElementById("prescriptionModal")
          );
          patientCtrl.fetchAppointments();
          prescriptionModal.hide();
        },
        function (error) {
          console.log("Error submitting prescription", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.data.error || "An unexpected error occurred!",
          });
        }
      );
    };

    patientCtrl.fetchAppointments();
  },
]);

app.controller("recordController", [
  "$http",
  "api_request",
  function ($http, api_request) {
    var recordCtrl = this;
    recordCtrl.all = [];
    recordCtrl.role = {};
    recordCtrl.searchQuery = "";
    recordCtrl.searchResults = [];

    recordCtrl.fetchAll = function () {
      api_request.get_withdata("vitalcure/records/", function (response) {
        recordCtrl.all = response.details;
        recordCtrl.role = response.role;
        recordCtrl.search();
      });
    };

    recordCtrl.deleteAppointment = function (patientId) {
      if (confirm("Are you sure you want to delete this appointment?")) {
        api_request.patch_withdata(
          "vitalcure/delete_appointment/",
          {
            id: patientId,
          },
          function (response) {
            console.log(response);
            Swal.fire({
              icon: "success",
              text: response.message,
            });
            recordCtrl.fetchAll();
          }
        );
      }
    };

    recordCtrl.search = function () {
      if (recordCtrl.searchQuery.length > 0) {
        recordCtrl.searchResults = recordCtrl.all.filter(function (patient) {
          return (
            patient.name
              .toLowerCase()
              .includes(recordCtrl.searchQuery.toLowerCase()) ||
            (patient.doctor &&
              patient.doctor
                .toLowerCase()
                .includes(recordCtrl.searchQuery.toLowerCase()))
          );
        });
      } else {
        recordCtrl.searchResults = [];
      }
    };

    recordCtrl.exportToExcel = function () {
      var data = recordCtrl.all;
      var htmlContent =
        "<table><tr><th>ID</th><th>Patient Name</th><th>Email</th><th>Doctor</th><th>Appointment Date</th><th>Reason</th><th>Status</th></tr>";

      data.forEach(function (patient) {
        htmlContent += "<tr>";
        htmlContent += `<td>${patient.id}</td>`;
        htmlContent += `<td>${patient.name}</td>`;
        htmlContent += `<td>${patient.email}</td>`;
        htmlContent += `<td>${patient.doctor || ""}</td>`;
        htmlContent += `<td>${new Date(
          patient.preferred_date
        ).toLocaleDateString()}</td>`;
        htmlContent += `<td>${patient.reason}</td>`;
        htmlContent += `<td>${patient.status}</td>`;
        htmlContent += "</tr>";
      });

      htmlContent += "</table>";

      var blob = new Blob([htmlContent], { type: "application/vnd.ms-excel" });
      var link = document.createElement("a");
      if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "patient_records.xls");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    recordCtrl.fetchAll();
  },
]);

app.controller("presController", [
  "$http",
  "$window",
  "$scope",
  "$timeout",
  "$interval",
  "api_request",
  function ($http, $window, $scope, $timeout, $interval, api_request) {
    var presCtrl = this;
    presCtrl.pres = [];
    presCtrl.error = null;

    presCtrl.fetchPrescriptions = function () {
      presCtrl.error = null;

      api_request.get_withdata(
        "vitalcure/list_pres/",
        function (response) {
          presCtrl.pres = response.list;

          if (presCtrl.pres && presCtrl.pres.length > 0) {
            presCtrl.pres.sort(function (a, b) {
              return new Date(b.date) - new Date(a.date);
            });
          }
          if (!$scope.$phase) {
            $scope.$apply();
          }
        },
        function (error) {
          presCtrl.error = "Failed to load prescriptions. Please try again.";
          console.error("Error fetching prescriptions:", error);
          if (!$scope.$phase) {
            $scope.$apply();
          }
        }
      );
    };

    /**
     * Generate and download PDF for a specific prescription
     * @param {number} prescriptionId - The ID of the prescription to download
     */
    presCtrl.downloadPDF = function (prescriptionId) {
      var prescription = presCtrl.pres.find(function (p) {
        return p.id === prescriptionId;
      });

      if (!prescription) {
        return;
      }

      try {
        var printContent = document.getElementById(
          "prescription-" + prescriptionId
        ).outerHTML;
        var printWindow = $window.open("", "_blank", "width=800,height=600");

        if (!printWindow) {
          alert("Please allow pop-ups to download the prescription.");
          return;
        }

        printWindow.document.write(
          "<html><head><title>Prescription #" + prescriptionId + "</title>"
        );
        printWindow.document.write(
          '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">'
        );
        printWindow.document.write("<style>");
        printWindow.document.write(
          "@media print { body { padding: 20px; } .no-print { display: none !important; } }"
        );
        printWindow.document.write(
          "body { font-family: Arial, sans-serif; padding: 20px; }"
        );
        printWindow.document.write(
          ".card { border: 1px solid #ddd; margin-bottom: 20px; }"
        );
        printWindow.document.write(
          ".prescription-header { background-color: #0d6efd; color: white; padding: 15px; }"
        );
        printWindow.document.write(
          ".prescription-footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }"
        );
        printWindow.document.write("</style>");
        printWindow.document.write("</head><body>");
        printWindow.document.write('<div class="prescription-header">');
        printWindow.document.write(
          "<h2>Medical Prescription #" + prescription.id + "</h2>"
        );
        printWindow.document.write(
          "<p>Date: " +
            new Date(prescription.date).toLocaleDateString() +
            "</p>"
        );
        printWindow.document.write("</div>");

        // Prescription content
        printWindow.document.write(printContent);

        // Footer
        printWindow.document.write('<div class="prescription-footer">');
        printWindow.document.write(
          "<p>This is a digital copy of your prescription from VitalCure Healthcare.</p>"
        );
        printWindow.document.write(
          "<p>For medical emergencies, please contact your healthcare provider.</p>"
        );
        printWindow.document.write("</div>");

        // Print buttons
        printWindow.document.write('<div class="text-center mt-4 no-print">');
        printWindow.document.write(
          '<button class="btn btn-primary me-2" onclick="window.print()">Print</button>'
        );
        printWindow.document.write(
          '<button class="btn btn-secondary" onclick="window.close()">Close</button>'
        );
        printWindow.document.write("</div>");

        printWindow.document.write("</body></html>");
        printWindow.document.close();

        printWindow.focus();
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("There was an error generating the PDF. Please try again.");
      }
    };

    presCtrl.downloadAllPDF = function () {
      if (!presCtrl.pres || presCtrl.pres.length === 0) {
        return;
      }

      try {
        var printContent = document.querySelector(".row.g-4").outerHTML;
        var printWindow = $window.open("", "_blank", "width=800,height=600");

        if (!printWindow) {
          alert("Please allow pop-ups to download prescriptions.");
          return;
        }

        printWindow.document.write(
          "<html><head><title>All Prescriptions</title>"
        );
        printWindow.document.write(
          '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">'
        );
        printWindow.document.write("<style>");
        printWindow.document.write(
          "@media print { body { padding: 20px; } .no-print { display: none !important; } }"
        );
        printWindow.document.write(
          "body { font-family: Arial, sans-serif; padding: 20px; }"
        );
        printWindow.document.write(
          ".card { border: 1px solid #ddd; margin-bottom: 20px; break-inside: avoid; page-break-inside: avoid; }"
        );
        printWindow.document.write(
          ".prescription-header { background-color: #0d6efd; color: white; padding: 15px; text-align: center; margin-bottom: 20px; }"
        );
        printWindow.document.write(
          ".prescription-footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }"
        );
        printWindow.document.write("</style>");
        printWindow.document.write("</head><body>");

        // Custom header
        printWindow.document.write('<div class="prescription-header">');
        printWindow.document.write("<h2>Medical Prescription History</h2>");
        printWindow.document.write(
          "<p>Generated on: " + new Date().toLocaleDateString() + "</p>"
        );
        printWindow.document.write("</div>");

        // Prescriptions content
        printWindow.document.write('<div class="container-fluid">');
        printWindow.document.write(printContent);
        printWindow.document.write("</div>");

        // Footer
        printWindow.document.write('<div class="prescription-footer">');
        printWindow.document.write(
          "<p>This is a digital copy of your prescription history from VitalCure Healthcare.</p>"
        );
        printWindow.document.write(
          "<p>For medical emergencies, please contact your healthcare provider.</p>"
        );
        printWindow.document.write("</div>");

        // Print buttons
        printWindow.document.write('<div class="text-center mt-4 no-print">');
        printWindow.document.write(
          '<button class="btn btn-primary me-2" onclick="window.print()">Print</button>'
        );
        printWindow.document.write(
          '<button class="btn btn-secondary" onclick="window.close()">Close</button>'
        );
        printWindow.document.write("</div>");

        printWindow.document.write("</body></html>");
        printWindow.document.close();

        printWindow.focus();
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("There was an error generating the PDF. Please try again.");
      }
    };

    presCtrl.fetchPrescriptions();

    var refreshInterval = $interval(function () {
      presCtrl.fetchPrescriptions();
    }, 300000);
    $scope.$on("$destroy", function () {
      if (refreshInterval) {
        $interval.cancel(refreshInterval);
      }
    });
  },
]);
