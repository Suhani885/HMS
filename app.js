const app = angular.module("app", ["ui.router", "ui.bootstrap"]);
var baseUrl = "https://vitalcure-i8gf.onrender.com";

app.service("LoaderService", function () {
  var loader = this;
  loader.isLoading = false;

  loader.show = function () {
    loader.isLoading = true;
  };

  loader.hide = function () {
    loader.isLoading = false;
  };
});

app.controller("LoaderController", [
  "LoaderService",
  function (LoaderService) {
    var loaderCtrl = this;
    loaderCtrl.loader = LoaderService;
  },
]);

app.service("api_request", [
  "$http",
  "$state",
  "LoaderService",
  function ($http, $state, LoaderService) {
    this.get_withdata = function (path, callback) {
      LoaderService.show();
      var req = {
        method: "GET",
        url: `${baseUrl}/${path}`,
        withCredentials: true,
      };
      $http(req).then(
        function (response) {
          LoaderService.hide();
          callback(response.data);
        },
        function (err) {
          LoaderService.hide();
          console.log("Error:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              err.data.error ||
              "An unexpected error occurred. Please try again!",
          });
        }
      );
    };

    this.post_withdata = function (path, data, callback) {
      LoaderService.show();
      var req = {
        method: "POST",
        url: `${baseUrl}/${path}`,
        data: data,
        withCredentials: true,
      };
      $http(req).then(
        function (response) {
          LoaderService.hide();
          callback(response.data);
        },
        function (err) {
          LoaderService.hide();
          console.log("Error:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              err.data.error ||
              "An unexpected error occurred. Please try again!",
          });
        }
      );
    };

    this.patch_withdata = function (path, data, callback) {
      LoaderService.show();
      var req = {
        method: "PATCH",
        url: `${baseUrl}/${path}`,
        data: data,
        withCredentials: true,
      };
      $http(req).then(
        function (response) {
          LoaderService.hide();
          callback(response.data);
        },
        function (err) {
          LoaderService.hide();
          console.log("Error:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              err.data.error ||
              "An unexpected error occurred. Please try again!",
          });
        }
      );
    };

    this.upload_withdata = function (path, formData, callback) {
      LoaderService.show();
      var req = {
        method: "POST",
        url: `${baseUrl}/${path}`,
        headers: { "Content-Type": undefined },
        data: formData,
        withCredentials: true,
      };
      $http(req).then(
        function (response) {
          LoaderService.hide();
          callback(response.data);
        },
        function (error) {
          LoaderService.hide();
          console.log("Error:", error);
          Swal.fire({
            icon: "error",
            title: "Upload Failed",
            text:
              error.data.error ||
              "An unexpected error occurred. Please try again!",
          });
        }
      );
    };
  },
]);
