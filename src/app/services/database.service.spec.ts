import { TestBed } from "@angular/core/testing";

import { databaseService } from "./database.service";

describe("databaseService", () => {
  let service: databaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(databaseService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
