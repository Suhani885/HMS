app.controller("pRegController", [
  "$http",
  "$state",
  "api_request",
  function ($http, $state, api_request) {
    var pRegCtrl = this;
    pRegCtrl.bgs = [];

    pRegCtrl.img = function (element) {
      pRegCtrl.image = element.files[0];
    };

    pRegCtrl.fetchbgs = function () {
      api_request.get_withdata("vitalcure/list_bg/", function (response) {
        pRegCtrl.bgs = response.list;
      });
    };

    pRegCtrl.Register = function () {
      console.log(pRegCtrl.email, pRegCtrl.pass1, pRegCtrl.pass2);
      if (pRegCtrl.pass1 !== pRegCtrl.pass2) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Passwords do not match!!!",
        });
        return;
      }
      var formData = new FormData();
      formData.append("first_name", pRegCtrl.fname);
      formData.append("last_name", pRegCtrl.lname);
      formData.append("email", pRegCtrl.email);
      formData.append("phone_number", pRegCtrl.number);
      formData.append("date_of_birth", pRegCtrl.dob);
      // formData.append("age", pRegCtrl.age);
      formData.append("blood_group", pRegCtrl.bloodgrp);
      formData.append("address", pRegCtrl.address);
      formData.append("gender", pRegCtrl.gender);
      formData.append("height", pRegCtrl.height);
      formData.append("weight", pRegCtrl.weight);
      formData.append("medical_history", pRegCtrl.med);
      formData.append("password", pRegCtrl.pass1);
      formData.append("cpassword", pRegCtrl.pass2);
      formData.append("image", pRegCtrl.image);
      formData.set("last_name", pRegCtrl.lname || "");
      formData.set("medical_history", pRegCtrl.med || "");

      api_request.upload_withdata(
        "vitalcure/patient_register/",
        formData,
        function (response) {
          console.log(response);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: response.message,
          }).then(() => {
            $state.go("login");
          });
        }
      );
    };

    pRegCtrl.fetchbgs();
  },
]);

app.controller("docRegController", [
  "$http",
  "$state",
  "api_request",
  function ($http, $state, api_request) {
    var docRegCtrl = this;
    docRegCtrl.specialists = [];

    docRegCtrl.img = function (element) {
      docRegCtrl.image = element.files[0];
    };

    docRegCtrl.Register = function () {
      console.log(docRegCtrl.email, docRegCtrl.pass1, docRegCtrl.pass2);
      if (docRegCtrl.pass1 !== docRegCtrl.pass2) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Passwords do not match!!!",
        });
        return;
      }
      var formData = new FormData();
      formData.append("first_name", docRegCtrl.fname);
      formData.append("last_name", docRegCtrl.lname);
      formData.append("email", docRegCtrl.email);
      formData.append("phone_number", docRegCtrl.number);
      formData.append("specialist", docRegCtrl.specialist);
      formData.append("age", docRegCtrl.age);
      formData.append("experience", docRegCtrl.exp);
      formData.append("qualification", docRegCtrl.qualify);
      formData.append("gender", docRegCtrl.gender);
      formData.append("consultation_fee", docRegCtrl.fee);
      formData.append("password", docRegCtrl.pass1);
      formData.append("cpassword", docRegCtrl.pass2);
      formData.append("image", docRegCtrl.image);
      formData.set("last_name", docRegCtrl.lname || "");

      api_request.upload_withdata(
        "vitalcure/doctor_register/",
        formData,
        function (response) {
          console.log(response);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: response.message,
          }).then(() => {
            $state.go("login");
          });
        }
      );
    };

    docRegCtrl.fetchSpecialization = function () {
      api_request.get_withdata(
        "vitalcure/list_specialisation/",
        function (response) {
          docRegCtrl.specialists = response.list;
        }
      );
    };

    docRegCtrl.fetchSpecialization();
  },
]);

app.controller("LoginController", [
  "$http",
  "$state",
  "api_request",
  function ($http, $state, api_request) {
    var loginCtrl = this;
    loginCtrl.email = "";
    loginCtrl.password = "";

    loginCtrl.login = function () {
      api_request.post_withdata(
        "vitalcure/login_user/",
        {
          email: loginCtrl.email,
          password: loginCtrl.password,
        },
        function (response) {
          console.log(response);
          $state.go("user");
        }
      );
    };
  },
]);
