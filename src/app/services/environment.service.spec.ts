import { TestBed } from "@angular/core/testing";

import { EnvironmentService } from "./environment.service";

describe("databaseService", () => {
  let service: EnvironmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironmentService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
