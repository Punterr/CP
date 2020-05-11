sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, formatter, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("com.airbus.unc.main.CP.controller.InvoiceList", {
		formatter: formatter,
		onInit: function () {
			var oViewModel = new JSONModel({
				currency: "INR"
			});
			this.getView().setModel(oViewModel, "view");
		},
		onFilterInvoices: function (oEvent) {

			// build filter array

			var oList = this.byId("invoiceList");
			var oBinding = oList.getBinding("items");
			var aFilter = oBinding.aFilters;
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
			}

			// filter binding
			oBinding.filter(aFilter);
		},
		onFilterQuantity: function (oEvent) {

			// build filter array

			var oList = this.byId("invoiceList");
			var oBinding = oList.getBinding("items");
			var aFilter = oBinding.aFilters;
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("Quantity", FilterOperator.GT, sQuery));
			}

			oBinding.filter(aFilter);
		},
		onPress: function (oEvent) {
			var oItem = oEvent.getSource();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail", {
				invoicePath: window.encodeURIComponent(oItem.getBindingContext("invoice").getPath().substr(1))
			});
		}

	});
});