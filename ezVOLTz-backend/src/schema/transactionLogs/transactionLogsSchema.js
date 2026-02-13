import { boolean, number, object, string } from 'yup';

export const addLogsWebhookSchema = object({
  idTag: string().required('idTag is required.'),
  driverId: string().required('Driver id is required.'),
  transactionPk: string().required('Transaction Pk is required.'),
  startTransactionTs: string().required('Start transaction time is required.'),
  endTransactionTs: string().required('End transaction time is required.'),
  meterValueStart: string().required('Meter start value is required.'),
  meterValueStop: string().required('Meter stop value is required.'),
  // paymentId: string().required('Stripe Payment Id is required.'),
  chargeBoxId: string().required('ChargeBox Id is required.'),
  connectorId: string().required('Connector Id is required.'),
  connectorName: string().required('Connector Name is required.'),
  kwhConsumed: string().required('kwhConsumed is required.'),
  calculatedPrice: string().required('Calculated Price is required.'),
  priceComponents: object().shape({
    // pricePerKwh: string().required('Price Per Kwh location is required.'),
    // pricePerMinute: number().required('Price Per Minute is required.'),
    // priceFlatFee: number().required('Price Flat Fee is required.'),
    // pricePercentFee: number().required('Price Percent Fee is required.'),
    pricePerKwh: string(),
    pricePerMinute: number(),
    priceFlatFee: number(),
    pricePercentFee: number(),
    vatIncluded: boolean(),
  }),
});

export const addStartChargingWebhookSchema = object({
  stationTransactionId: number().required('transactionPk is required.'),
  idTag: string().required('idTag is required.'),
  startTimestamp: string().required('Start Timestamp is required.'),
});

export const cancelChargingWebhookValidator = object({
  chargeBoxId: string().required('ChargeBox Id is required.'),
  connectorId: number().required('Connector Id is required.'),
  timestamp: string().nullable(),
  status: string().required('Status is required.'),
});

export const updateChargerStatusWebhookSchema = object({
  chargeBoxId: string().required('ChargeBox Id is required.'),
  connectorId: number().required('Connector Id is required.'),
  timestamp: string().nullable(),
  status: string().required('Status is required.'),
});