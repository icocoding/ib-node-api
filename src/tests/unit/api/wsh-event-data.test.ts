import { IBApi } from "../../../api/api";
import WshEventData from "../../../api/contract/wsh";
import { EventName } from "../../../api/data/enum/event-name";
import configuration from "../../../common/configuration";

describe("IBApi Fundamental Data", () => {
  jest.setTimeout(5000);

  let ib: IBApi;
  const clientId = Math.floor(Math.random() * 32766) + 1; // ensure unique client

  beforeEach(() => {
    ib = new IBApi({
      host: configuration.ib_host,
      port: configuration.ib_port,
      clientId,
    });
  });

  afterEach(() => {
    if (ib) {
      ib.disconnect();
      ib = undefined;
    }
  });

  test("reqWshMetaData", (done) => {
    const refId = 1;
    ib.once(EventName.connected, () => {
      ib.reqWshMetaData(refId);
    })
      .on(EventName.wshMetaData, (reqId, dataJson: string) => {
        expect(reqId).toEqual(refId);
        console.log(dataJson);
        ib.disconnect();
      })
      .on(EventName.disconnected, () => {
        done();
      })
      .on(EventName.error, (err, code, reqId) => {
        if (reqId == refId) done(`[${reqId}] ${err.message} (#${code})`);
      });

    ib.connect();
  });

  test("reqWshEventData deprecated", (done) => {
    const refId = 2;
    ib.once(EventName.connected, () => {
      ib.reqWshEventData(refId, 8314);
    })
      .on(EventName.wshEventData, (reqId, dataJson: string) => {
        expect(reqId).toEqual(refId);
        console.log(dataJson);
      })
      .on(EventName.scannerDataEnd, (reqId) => {
        expect(reqId).toEqual(refId);
        if (ib) ib.disconnect();
      })
      .on(EventName.disconnected, () => {
        done();
      })
      .on(EventName.error, (err, code, reqId) => {
        if (reqId == refId) done(`[${reqId}] ${err.message} (#${code})`);
      });

    ib.connect();
  });

  test("reqWshEventData", (done) => {
    const refId = 3;
    ib.once(EventName.connected, () => {
      ib.reqWshEventData(
        refId,
        new WshEventData(8314, false, false, false, "20220511", "", 5),
      );
    })
      .on(EventName.wshEventData, (reqId, dataJson: string) => {
        expect(reqId).toEqual(refId);
        console.log(dataJson);
      })
      .on(EventName.scannerDataEnd, (reqId) => {
        expect(reqId).toEqual(refId);
        if (ib) ib.disconnect();
      })
      .on(EventName.disconnected, () => {
        done();
      })
      .on(EventName.error, (err, code, reqId) => {
        if (reqId == refId) done(`[${reqId}] ${err.message} (#${code})`);
      });

    ib.connect();
  });
});
