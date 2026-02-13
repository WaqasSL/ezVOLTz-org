import { object, string } from "yup";

export const startChargeSchema = new object({
  idTag: string().required("Id tag is required."),
  chargeBoxId: string().required("Charge Box Id is required."),
  connectorId: string().required("Connector Id is required."),
  connectorName: string().required("Connector Name is required."),
  vehicleId: string().required("Vehicle Id is required."),
  userId: string().required("User Id is required."),
  soapUrl: string(),
});

export const stopChargeSchema = new object({
  chargerId: string().required("Charger Id tag is required."),
  idTag: string().required("Id tag is required."),
  chargeBoxId: string().required("Charge Box Id is required."),
  // transactionId: string().required('Transaction Id is required.'),
  userId: string().required("User Id is required."),
  soapUrl: string(),
});

export const cancelChargeSchema = new object({
  chargerId: string().required("Charger Id tag is required."),
  userId: string().required("User Id is required."),
});
