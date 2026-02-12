import {
  translateTristate,
  translateTags,
  translateChangesFilters,
  translateConfigsFilters
} from "../filterTranslation";

describe("filterTranslation", () => {
  describe("translateTristate", () => {
    it("should handle simple includes", () => {
      expect(translateTristate("diff,create,delete")).toBe(
        "diff:1,create:1,delete:1"
      );
    });

    it("should handle excludes", () => {
      expect(translateTristate("diff,-BackOff")).toBe("diff:1,BackOff:-1");
    });

    it("should handle mixed includes and excludes", () => {
      expect(translateTristate("diff,-BackOff,-CrashLoopBackOff,create")).toBe(
        "diff:1,BackOff:-1,CrashLoopBackOff:-1,create:1"
      );
    });

    it("should handle separator replacement", () => {
      expect(
        translateTristate("AWS::Account,-Kubernetes::Pod", ["::", "__"])
      ).toBe("AWS__Account:1,Kubernetes__Pod:-1");
    });

    it("should return undefined for empty input", () => {
      expect(translateTristate("")).toBeUndefined();
      expect(translateTristate(undefined)).toBeUndefined();
    });

    it("should trim whitespace", () => {
      expect(translateTristate(" diff , -BackOff , create ")).toBe(
        "diff:1,BackOff:-1,create:1"
      );
    });
  });

  describe("translateTags", () => {
    it("should handle simple include", () => {
      expect(translateTags("env=production")).toBe("env____production:1");
    });

    it("should handle exclude", () => {
      expect(translateTags("!env=staging")).toBe("env____staging:-1");
    });

    it("should handle mixed includes and excludes", () => {
      expect(translateTags("env=production,!env=staging")).toBe(
        "env____production:1,env____staging:-1"
      );
    });

    it("should handle multiple tags", () => {
      expect(translateTags("env=prod,team=platform,!region=us-east-1")).toBe(
        "env____prod:1,team____platform:1,region____us-east-1:-1"
      );
    });

    it("should return undefined for empty input", () => {
      expect(translateTags("")).toBeUndefined();
      expect(translateTags(undefined)).toBeUndefined();
    });

    it("should trim whitespace", () => {
      expect(translateTags(" env = prod , ! env = staging ")).toBe(
        "env____prod:1,env____staging:-1"
      );
    });

    it("should skip invalid formats", () => {
      expect(translateTags("env=prod,invalid,no_equals,team=platform")).toBe(
        "env____prod:1,team____platform:1"
      );
    });
  });

  describe("translateChangesFilters", () => {
    it("should translate all filter fields", () => {
      const input = {
        configTypes: "AWS::Account,-Kubernetes::Pod",
        changeType: "diff,-BackOff",
        severity: "high",
        from: "24h",
        to: "",
        tags: "env=prod,!env=staging",
        source: "kubernetes,-github",
        summary: "-Failed",
        createdBy: "user@example.com,-bot"
      };

      const result = translateChangesFilters(input);

      expect(result.configTypes).toBe("AWS__Account:1,Kubernetes__Pod:-1");
      expect(result.changeType).toBe("diff:1,BackOff:-1");
      expect(result.severity).toBe("high");
      expect(result.from).toBe("24h");
      expect(result.to).toBe("");
      expect(result.tags).toBe("env____prod:1,env____staging:-1");
      expect(result.source).toBe("kubernetes:1,github:-1");
      expect(result.summary).toBe("Failed:-1");
      expect(result.createdBy).toBe("user@example.com:1,bot:-1");
    });

    it("should handle undefined fields", () => {
      const input = {
        severity: "medium"
      };

      const result = translateChangesFilters(input);

      expect(result.severity).toBe("medium");
      expect(result.configTypes).toBeUndefined();
      expect(result.tags).toBeUndefined();
    });
  });

  describe("translateConfigsFilters", () => {
    it("should translate all filter fields", () => {
      const input = {
        search: "database",
        configType: "AWS::RDS::Instance",
        labels: "app=nginx,!team=dev",
        status: "Running,-Stopped",
        health: "-healthy,warning"
      };

      const result = translateConfigsFilters(input);

      expect(result.search).toBe("database");
      expect(result.configType).toBe("AWS::RDS::Instance");
      expect(result.labels).toBe("app____nginx:1,team____dev:-1");
      expect(result.status).toBe("Running:1,Stopped:-1");
      expect(result.health).toBe("healthy:-1,warning:1");
    });

    it("should handle undefined fields", () => {
      const input = {
        configType: "Kubernetes::Pod"
      };

      const result = translateConfigsFilters(input);

      expect(result.configType).toBe("Kubernetes::Pod");
      expect(result.labels).toBeUndefined();
      expect(result.status).toBeUndefined();
    });
  });
});
