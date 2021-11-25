export const subsetOne = [
  {
    key: "demo/http-pass/http:http://status.savanttools.com/?code=404",
    type: "http",
    name: "demo/http-pass",
    namespace: "demo",
    labels: {
      DBAdmin: "true",
      high: "true",
      test: "istest2"
    },
    runnerLabels: null,
    canaryName: "http-pass",
    description: "",
    endpoint: "http://status.savanttools.com/?code=404",
    uptime: { passed: 820, failed: 0 },
    latency: { rolling1h: 166.5 },
    checkStatuses: null,
    interval: 30,
    schedule: "",
    owner: "",
    severity: "",
    icon: "",
    displayType: ""
  },
  {
    key: "demo/http-fail-timeout/http:http://httpstat.us/200?sleep=200",
    type: "http",
    name: "demo/http-fail-timeout",
    namespace: "",
    labels: {},
    runnerLabels: null,
    canaryName: "http-fail-timeout",
    description: "",
    endpoint: "http://httpstat.us/200?sleep=200",
    uptime: { passed: 0, failed: 120 },
    latency: { rolling1h: 1310.5 },
    checkStatuses: null,
    interval: 30,
    schedule: "",
    owner: "",
    severity: "",
    icon: "",
    displayType: ""
  },
  {
    key: "demo/junit-pass/junit:jes",
    type: "junit",
    name: "demo/junit-pass",
    namespace: "",
    labels: { DBAdmin: "true", high: "true", test: "istest" },
    runnerLabels: null,
    canaryName: "junit-pass",
    description: "",
    endpoint: "jes",
    uptime: {
      passed: 0,
      failed: 317
    },
    latency: {
      rolling1h: 50500
    },
    checkStatuses: [
      {
        status: false,
        invalid: false,
        time: "2021-09-07T07:17:51Z",
        duration: 50500,
        message: "",
        error:
          'error executing template ✅ {{.results.passed}} ❌ {{.results.failed}} in 🕑 {{.results.duration}}: template: :1:14: executing "" at <.results.passed>: can\'t evaluate field passed in type interface {}'
      },
      {
        status: false,
        invalid: false,
        time: "2021-09-07T07:15:51Z",
        duration: 50500,
        message: "",
        error:
          'error executing template ✅ {{.results.passed}} ❌ {{.results.failed}} in 🕑 {{.results.duration}}: template: :1:14: executing "" at <.results.passed>: can\'t evaluate field passed in type interface {}'
      },
      {
        status: false,
        invalid: false,
        time: "2021-09-07T07:13:51Z",
        duration: 50500,
        message: "",
        error:
          'error executing template ✅ {{.results.passed}} ❌ {{.results.failed}} in 🕑 {{.results.duration}}: template: :1:14: executing "" at <.results.passed>: can\'t evaluate field passed in type interface {}'
      },
      {
        status: false,
        invalid: false,
        time: "2021-09-07T07:11:51Z",
        duration: 50500,
        message: "",
        error:
          'error executing template ✅ {{.results.passed}} ❌ {{.results.failed}} in 🕑 {{.results.duration}}: template: :1:14: executing "" at <.results.passed>: can\'t evaluate field passed in type interface {}'
      },
      {
        status: false,
        invalid: false,
        time: "2021-09-07T07:09:51Z",
        duration: 50500,
        message: "",
        error:
          'error executing template ✅ {{.results.passed}} ❌ {{.results.failed}} in 🕑 {{.results.duration}}: template: :1:14: executing "" at <.results.passed>: can\'t evaluate field passed in type interface {}'
      }
    ],
    interval: 120,
    schedule: "",
    owner: "DBAdmin",
    severity: "high",
    icon: "",
    displayType: ""
  },
  {
    key: "demo/http-pass/http:http://status.savanttools.com/?code=200",
    type: "http",
    name: "demo/http-pass",
    namespace: "demo",
    labels: {
      DBAdmin: "true",
      high: "true",
      test: "istest"
    },
    runnerLabels: null,
    canaryName: "http-pass",
    description: "",
    endpoint: "http://status.savanttools.com/?code=200",
    uptime: { passed: 820, failed: 0 },
    latency: { rolling1h: 181.5 },
    checkStatuses: null,
    interval: 30,
    schedule: "",
    owner: "",
    severity: "",
    icon: "",
    displayType: ""
  },
  {
    key: "demo/dns-fail/dns:CNAME/dns.google@8.8.8.8:53",
    type: "dns",
    name: "demo/dns-fail",
    namespace: "demo",
    labels: {
      anothertest: "istest"
    },
    runnerLabels: null,
    canaryName: "dns-fail",
    description: "",
    endpoint: "CNAME/dns.google@8.8.8.8:53",
    uptime: { passed: 0, failed: 354 },
    latency: { rolling1h: 18.80000000000001 },
    checkStatuses: [
      {
        status: false,
        invalid: false,
        time: "2021-10-29T05:54:24Z",
        duration: 13,
        message: "",
        error:
          "CNAME dns.google on 8.8.8.8: Got [dns.google.], expected [wrong.google.]"
      },
      {
        status: false,
        invalid: false,
        time: "2021-10-29T05:53:54Z",
        duration: 13,
        message: "",
        error:
          "CNAME dns.google on 8.8.8.8: Got [dns.google.], expected [wrong.google.]"
      },
      {
        status: false,
        invalid: false,
        time: "2021-10-29T05:53:24Z",
        duration: 14,
        message: "",
        error:
          "CNAME dns.google on 8.8.8.8: Got [dns.google.], expected [wrong.google.]"
      }
    ],
    interval: 30,
    schedule: "",
    owner: "",
    severity: "",
    icon: "",
    displayType: ""
  },
  {
    key: "demo/docker-fail/dockerPull:docker.io/busybox",
    type: "dockerPull",
    name: "demo/docker-fail",
    namespace: "nametest",
    labels: {
      anothertest: "istest2"
    },
    runnerLabels: null,
    canaryName: "docker-fail",
    description: "",
    endpoint: "docker.io/busybox",
    uptime: { passed: 0, failed: 111 },
    latency: { rolling1h: 3140.8 },
    checkStatuses: [
      {
        status: false,
        invalid: false,
        time: "2021-10-29T05:53:58Z",
        duration: 2779,
        message: "",
        error:
          "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
      }
    ],
    interval: 30,
    schedule: "",
    owner: "",
    severity: "",
    icon: "",
    displayType: ""
  }
];

export const testData = {
  runnerName: "local",
  checks: [
    ...subsetOne,
    {
      key: "demo/docker-push-fail/dockerPush:docker.io/flanksource/busybox:1.30",
      type: "dockerPush",
      name: "demo/docker-push-fail",
      namespace: "nametest",
      labels: {},
      runnerLabels: null,
      canaryName: "docker-push-fail",
      description: "",
      endpoint: "docker.io/flanksource/busybox:1.30",
      uptime: { passed: 0, failed: 2129 },
      latency: { rolling1h: 0 },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:55Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: flanksource/busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:25Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: flanksource/busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:52:55Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: flanksource/busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:52:25Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: flanksource/busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:51:55Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: flanksource/busybox"
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/ldap-pass/ldap:ldap://apacheds.ldap.svc:10389",
      type: "ldap",
      name: "demo/ldap-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "ldap-pass",
      description: "",
      endpoint: "ldap://apacheds.ldap.svc:10389",
      uptime: { passed: 0, failed: 224 },
      latency: { rolling1h: 0 },
      checkStatuses: null,
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/dns-fail/dns:TXT/flanksource.com@8.8.8.8:53",
      type: "dns",
      name: "demo/dns-fail",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "dns-fail",
      description: "",
      endpoint: "TXT/flanksource.com@8.8.8.8:53",
      uptime: { passed: 0, failed: 354 },
      latency: { rolling1h: 23 },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:54:24Z",
          duration: 17,
          message: "",
          error:
            "TXT flanksource.com on 8.8.8.8: Got [MS=A335A42E8524D9CE2A69F77C5C50B40C2A810871 google-site-verification=IIE1aJuvqseLUKSXSIhu2O2lgdU_d8csfJjjIQVc-q0], expected [google-site-verification=IIE1aJuvqseLUKSXSIhu2O2lgdU_d8csfJjjIQVc-q0]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:54Z",
          duration: 12,
          message: "",
          error:
            "TXT flanksource.com on 8.8.8.8: Got [MS=A335A42E8524D9CE2A69F77C5C50B40C2A810871 google-site-verification=IIE1aJuvqseLUKSXSIhu2O2lgdU_d8csfJjjIQVc-q0], expected [google-site-verification=IIE1aJuvqseLUKSXSIhu2O2lgdU_d8csfJjjIQVc-q0]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:24Z",
          duration: 12,
          message: "",
          error:
            "TXT flanksource.com on 8.8.8.8: Got [MS=A335A42E8524D9CE2A69F77C5C50B40C2A810871 google-site-verification=IIE1aJuvqseLUKSXSIhu2O2lgdU_d8csfJjjIQVc-q0], expected [google-site-verification=IIE1aJuvqseLUKSXSIhu2O2lgdU_d8csfJjjIQVc-q0]"
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/redis-succeed/redis:The redis pass test",
      type: "redis",
      name: "demo/redis-succeed",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "redis-succeed",
      description: "The redis pass test",
      endpoint: "redis.default.svc:6379",
      uptime: { passed: 353, failed: 0 },
      latency: { rolling1h: 11 },
      checkStatuses: null,
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/docker-fail/dockerPull:docker.io/library/busybox:random",
      type: "dockerPull",
      name: "demo/docker-fail",
      namespace: "nametest",
      labels: {},
      runnerLabels: null,
      canaryName: "docker-fail",
      description: "",
      endpoint: "docker.io/library/busybox:random",
      uptime: { passed: 0, failed: 111 },
      latency: { rolling1h: 1879.95 },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:58Z",
          duration: 1860,
          message: "",
          error:
            "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/docker-push0-pass/dockerPush:ttl.sh/flanksource-busybox:1.30",
      type: "dockerPush",
      name: "demo/docker-push0-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "docker-push0-pass",
      description: "",
      endpoint: "ttl.sh/flanksource-busybox:1.30",
      uptime: { passed: 0, failed: 2129 },
      latency: { rolling1h: 0 },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:55Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: ttl.sh/flanksource-busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:25Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: ttl.sh/flanksource-busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:52:55Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: ttl.sh/flanksource-busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:52:25Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: ttl.sh/flanksource-busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:51:55Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: ttl.sh/flanksource-busybox"
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/http-fail/http:http://status.savanttools.com/?code=500",
      type: "http",
      name: "demo/http-fail",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "http-fail",
      description: "",
      endpoint: "http://status.savanttools.com/?code=500",
      uptime: { passed: 20, failed: 352 },
      latency: { rolling1h: 184 },
      checkStatuses: null,
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/dns-pass/dns:MX/flanksource.com@8.8.8.8:53",
      type: "dns",
      name: "demo/dns-pass",
      namespace: "nametest",
      labels: { DBAdmin: "true", high: "true" },
      runnerLabels: null,
      canaryName: "dns-pass",
      description: "",
      endpoint: "MX/flanksource.com@8.8.8.8:53",
      uptime: { passed: 353, failed: 80 },
      latency: { rolling1h: 17 },
      checkStatuses: [
        {
          status: true,
          invalid: false,
          time: "2021-10-29T05:53:55Z",
          duration: 12,
          message: ""
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/dns-pass/dns:NS/flanksource.com@8.8.8.8:53",
      type: "dns",
      name: "demo/dns-pass",
      namespace: "demo",
      labels: { DBAdmin: "true", high: "true" },
      runnerLabels: null,
      canaryName: "dns-pass",
      description: "",
      endpoint: "NS/flanksource.com@8.8.8.8:53",
      uptime: { passed: 353, failed: 6 },
      latency: { rolling1h: 18 },
      checkStatuses: [
        {
          status: true,
          invalid: false,
          time: "2021-10-29T05:53:55Z",
          duration: 12,
          message: ""
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/docker-fail/dockerPull:docker.io/library/busybox:1.31.1",
      type: "dockerPull",
      name: "demo/docker-fail",
      namespace: "nametest",
      labels: {},
      runnerLabels: null,
      canaryName: "docker-fail",
      description: "",
      endpoint: "docker.io/library/busybox:1.31.1",
      uptime: { passed: 0, failed: 111 },
      latency: { rolling1h: 945.95 },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:58Z",
          duration: 926,
          message: "",
          error:
            "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/junit-fail/junit:jes",
      type: "junit",
      name: "demo/junit-fail",
      namespace: "nametest",
      labels: { DBAdmin: "true", high: "true" },
      runnerLabels: null,
      canaryName: "junit-fail",
      description: "",
      endpoint: "jes",
      uptime: { passed: 0, failed: 25 },
      latency: { rolling1h: 50506 },
      checkStatuses: null,
      interval: 120,
      schedule: "",
      owner: "DBAdmin",
      severity: "high",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/namespace-pass/namespace:check",
      type: "namespace",
      name: "demo/namespace-pass",
      namespace: "nametest",
      labels: {},
      runnerLabels: null,
      canaryName: "namespace-pass",
      description: "",
      endpoint: "check",
      uptime: { passed: 0, failed: 312 },
      latency: { rolling1h: 0 },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:55Z",
          duration: 0,
          message:
            'unexpected error unable to create namespace: namespaces "test-foo-0" already exists'
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:25Z",
          duration: 0,
          message:
            'unexpected error unable to create namespace: namespaces "test-foo-9" already exists'
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:52:55Z",
          duration: 0,
          message:
            'unexpected error unable to create namespace: namespaces "test-foo-8" already exists'
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:52:25Z",
          duration: 0,
          message:
            'unexpected error unable to create namespace: namespaces "test-foo-7" already exists'
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:51:55Z",
          duration: 0,
          message:
            'unexpected error unable to create namespace: namespaces "test-foo-6" already exists'
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/postgres-fail/postgres:user=$(username) dbname=pqgotest sslmode=verify-full",
      type: "postgres",
      name: "demo/postgres-fail",
      namespace: "nametest",
      labels: {},
      runnerLabels: null,
      canaryName: "postgres-fail",
      description: "",
      endpoint: "user=$(username) dbname=pqgotest sslmode=verify-full",
      uptime: { passed: 0, failed: 3 },
      latency: { rolling1h: 1 },
      checkStatuses: null,
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/dns-pass/dns:CNAME/dns.google@8.8.8.8:53",
      type: "dns",
      name: "demo/dns-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "dns-pass",
      description: "",
      endpoint: "CNAME/dns.google@8.8.8.8:53",
      uptime: { passed: 353, failed: 0 },
      latency: { rolling1h: 17 },
      checkStatuses: [
        {
          status: true,
          invalid: false,
          time: "2021-10-29T05:53:55Z",
          duration: 13,
          message: ""
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/dns-pass/dns:TXT/flanksource.com@8.8.8.8:53",
      type: "dns",
      name: "demo/dns-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "dns-pass",
      description: "",
      endpoint: "TXT/flanksource.com@8.8.8.8:53",
      uptime: { passed: 0, failed: 353 },
      latency: { rolling1h: 23 },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:55Z",
          duration: 20,
          message: "",
          error:
            "TXT flanksource.com on 8.8.8.8: Got [MS=A335A42E8524D9CE2A69F77C5C50B40C2A810871 google-site-verification=IIE1aJuvqseLUKSXSIhu2O2lgdU_d8csfJjjIQVc-q0], expected [google-site-verification=IIE1aJuvqseLUKSXSIhu2O2lgdU_d8csfJjjIQVc-q0]"
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/http-pass/http:http://status.savanttools.com/?code=500",
      type: "http",
      name: "demo/http-pass",
      namespace: "demo",
      labels: {
        DBAdmin: "true",
        high: "true",
        test: "istest"
      },
      runnerLabels: null,
      canaryName: "http-pass",
      description: "",
      endpoint: "http://status.savanttools.com/?code=500",
      uptime: { passed: 820, failed: 0 },
      latency: { rolling1h: 159 },
      checkStatuses: null,
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/containerd-pull-pass/containerdPull:docker.io/library/busybox:1.31.1",
      type: "containerdPull",
      name: "demo/containerd-pull-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "containerd-pull-pass",
      description: "",
      endpoint: "docker.io/library/busybox:1.31.1",
      uptime: { passed: 0, failed: 103 },
      latency: { rolling1h: 0 },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:54:15Z",
          duration: 0,
          message:
            'failed to dial "/run/containerd/containerd.sock": context deadline exceeded'
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/pod-pass/pod:ruby",
      type: "pod",
      name: "demo/pod-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "pod-pass",
      description: "",
      endpoint: "ruby",
      uptime: { passed: 0, failed: 46 },
      latency: { rolling1h: 33123.4 },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:39Z",
          duration: 32198,
          message: "request timeout exceeded 0ms \u003e 7000"
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/mssql-fail/mssql:server=mssql.platformsystem;user id=sa;password=###;port=32010;database=master",
      type: "mssql",
      name: "demo/mssql-fail",
      namespace: "nametest",
      labels: {},
      runnerLabels: null,
      canaryName: "mssql-fail",
      description: "",
      endpoint:
        "server=mssql.platformsystem;user id=sa;password=###;port=32010;database=master",
      uptime: { passed: 0, failed: 0 },
      latency: { rolling1h: 0 },
      checkStatuses: null,
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/mongo/dns:/mongo.default.svc",
      type: "dns",
      name: "demo/mongo",
      namespace: "nametest",
      labels: {},
      runnerLabels: null,
      canaryName: "mongo",
      description: "",
      endpoint: "/mongo.default.svc",
      uptime: { passed: 354, failed: 0 },
      latency: { rolling1h: 12 },
      checkStatuses: null,
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/dns-pass/dns:PTR/8.8.8.8@8.8.8.8:53",
      type: "dns",
      name: "demo/dns-pass",
      namespace: "nametest",
      labels: {},
      runnerLabels: null,
      canaryName: "dns-pass",
      description: "",
      endpoint: "PTR/8.8.8.8@8.8.8.8:53",
      uptime: { passed: 353, failed: 0 },
      latency: { rolling1h: 3 },
      checkStatuses: [
        {
          status: true,
          invalid: false,
          time: "2021-10-29T05:53:55Z",
          duration: 2,
          message: ""
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/docker-push-fail/dockerPush:ttl.sh/flanksource-busybox:not-found-tag",
      type: "dockerPush",
      name: "demo/docker-push-fail",
      namespace: "nametest",
      labels: { test: "istest2" },
      runnerLabels: null,
      canaryName: "docker-push-fail",
      description: "",
      endpoint: "ttl.sh/flanksource-busybox:not-found-tag",
      uptime: { passed: 0, failed: 2129 },
      latency: { rolling1h: 0 },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:55Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: ttl.sh/flanksource-busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:25Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: ttl.sh/flanksource-busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:52:55Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: ttl.sh/flanksource-busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:52:25Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: ttl.sh/flanksource-busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:51:55Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: ttl.sh/flanksource-busybox"
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/docker-pass/dockerPull:docker.io/library/busybox:1.31.1@sha256:b20c55f6bfac8828690ec2f4e2da29790c80aa3d7801a119f0ea6b045d2d2da1",
      type: "dockerPull",
      name: "demo/docker-pass",
      namespace: "nametest",
      labels: {},
      runnerLabels: null,
      canaryName: "docker-pass",
      description: "",
      endpoint:
        "docker.io/library/busybox:1.31.1@sha256:b20c55f6bfac8828690ec2f4e2da29790c80aa3d7801a119f0ea6b045d2d2da1",
      uptime: { passed: 1, failed: 345 },
      latency: { rolling1h: 944 },
      checkStatuses: null,
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/pod-pass/pod:golang",
      type: "pod",
      name: "demo/pod-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "pod-pass",
      description: "",
      endpoint: "golang",
      uptime: { passed: 0, failed: 46 },
      latency: { rolling1h: 63547.7 },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:39Z",
          duration: 32295,
          message: "",
          error:
            'Pod "hello-world-golang-1" is invalid: spec: Forbidden: pod updates may not change fields other than `spec.containers[*].image`, `spec.initContainers[*].image`, `spec.activeDeadlineSeconds` or `spec.tolerations` (only additions to existing tolerations)\n  core.PodSpec{\n- \tVolumes: nil,\n+ \tVolumes: []core.Volume{\n+ \t\t{\n+ \t\t\tName:         "default-token-wppdg",\n+ \t\t\tVolumeSource: core.VolumeSource{Secret: \u0026core.SecretVolumeSource{...}},\n+ \t\t},\n+ \t},\n  \tInitContainers: nil,\n  \tContainers: []core.Container{\n  \t\t{\n  \t\t\t... // 7 identical fields\n  \t\t\tEnv:          nil,\n  \t\t\tResources:    {},\n- \t\t\tVolumeMounts: nil,\n+ \t\t\tVolumeMounts: []core.VolumeMount{\n+ \t\t\t\t{\n+ \t\t\t\t\tName:      "default-token-wppdg",\n+ \t\t\t\t\tReadOnly:  true,\n+ \t\t\t\t\tMountPath: "/var/run/secrets/kubernetes.io/serviceaccount",\n+ \t\t\t\t},\n+ \t\t\t},\n  \t\t\tVolumeDevices: nil,\n  \t\t\tLivenessProbe: nil,\n  \t\t\t... // 10 identical fields\n  \t\t},\n  \t},\n  \tEphemeralContainers: nil,\n  \tRestartPolicy:       "Always",\n  \t... // 2 identical fields\n  \tDNSPolicy:                    "ClusterFirst",\n  \tNodeSelector:                 {"kubernetes.io/hostname": "ip-10-0-6-82.eu-west-2.compute.internal"},\n- \tServiceAccountName:           "",\n+ \tServiceAccountName:           "default",\n  \tAutomountServiceAccountToken: nil,\n- \tNodeName:                     "",\n+ \tNodeName:                     "ip-10-0-6-82.eu-west-2.compute.internal",\n  \tSecurityContext:              \u0026{},\n- \tImagePullSecrets:             nil,\n+ \tImagePullSecrets:             []core.LocalObjectReference{{Name: "dockerhub"}},\n  \tHostname:                     "",\n  \tSubdomain:                    "",\n  \t... // 14 identical fields\n  }\n'
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/dns-fail/dns:PTR/8.8.8.8@8.8.8.8:53",
      type: "dns",
      name: "demo/dns-fail",
      namespace: "nametest",
      labels: {},
      runnerLabels: null,
      canaryName: "dns-fail",
      description: "",
      endpoint: "PTR/8.8.8.8@8.8.8.8:53",
      uptime: { passed: 0, failed: 354 },
      latency: { rolling1h: 4 },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:54:24Z",
          duration: 1,
          message: "",
          error: "PTR 8.8.8.8 on 8.8.8.8: returned 1 results, expecting 10"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:54Z",
          duration: 1,
          message: "",
          error: "PTR 8.8.8.8 on 8.8.8.8: returned 1 results, expecting 10"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:24Z",
          duration: 1,
          message: "",
          error: "PTR 8.8.8.8 on 8.8.8.8: returned 1 results, expecting 10"
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/dns-pass/dns:A/1.2.3.4.nip.io@8.8.8.8:53",
      type: "dns",
      name: "demo/dns-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "dns-pass",
      description: "",
      endpoint: "A/1.2.3.4.nip.io@8.8.8.8:53",
      uptime: { passed: 353, failed: 0 },
      latency: { rolling1h: 23.849999999999966 },
      checkStatuses: [
        {
          status: true,
          invalid: false,
          time: "2021-10-29T05:53:55Z",
          duration: 3,
          message: ""
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/postgres-succeed/postgres:postgres://postgres.default.svc:5432/postgres?sslmode=disable",
      type: "postgres",
      name: "demo/postgres-succeed",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "postgres-succeed",
      description: "",
      endpoint: "postgres://postgres.default.svc:5432/postgres?sslmode=disable",
      uptime: { passed: 0, failed: 0 },
      latency: { rolling1h: 0 },
      checkStatuses: null,
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/dns-fail/dns:A/1.2.3.4.nip.io@8.8.8.8:53",
      type: "dns",
      name: "demo/dns-fail",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "dns-fail",
      description: "",
      endpoint: "A/1.2.3.4.nip.io@8.8.8.8:53",
      uptime: { passed: 0, failed: 354 },
      latency: { rolling1h: 23.80000000000001 },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:54:24Z",
          duration: 2,
          message: "",
          error:
            "A 1.2.3.4.nip.io on 8.8.8.8: Got [1.2.3.4], expected [8.8.8.8]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:54Z",
          duration: 1,
          message: "",
          error:
            "A 1.2.3.4.nip.io on 8.8.8.8: Got [1.2.3.4], expected [8.8.8.8]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:24Z",
          duration: 4,
          message: "",
          error:
            "A 1.2.3.4.nip.io on 8.8.8.8: Got [1.2.3.4], expected [8.8.8.8]"
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/dns-fail/dns:MX/flanksource.com@8.8.8.8:53",
      type: "dns",
      name: "demo/dns-fail",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "dns-fail",
      description: "",
      endpoint: "MX/flanksource.com@8.8.8.8:53",
      uptime: { passed: 0, failed: 354 },
      latency: { rolling1h: 16.80000000000001 },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:54:24Z",
          duration: 14,
          message: "",
          error:
            "MX flanksource.com on 8.8.8.8: Got [alt1.aspmx.l.google.com. 5 alt2.aspmx.l.google.com. 5 aspmx.l.google.com. 1 aspmx2.googlemail.com. 10 aspmx3.googlemail.com. 10], expected [alt1.aspmx.l.google.com. 5 alt2.aspmx.l.google.com. 5 aspmx.l.google.com. 1]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:54Z",
          duration: 13,
          message: "",
          error:
            "MX flanksource.com on 8.8.8.8: Got [alt1.aspmx.l.google.com. 5 alt2.aspmx.l.google.com. 5 aspmx.l.google.com. 1 aspmx2.googlemail.com. 10 aspmx3.googlemail.com. 10], expected [alt1.aspmx.l.google.com. 5 alt2.aspmx.l.google.com. 5 aspmx.l.google.com. 1]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:24Z",
          duration: 13,
          message: "",
          error:
            "MX flanksource.com on 8.8.8.8: Got [alt1.aspmx.l.google.com. 5 alt2.aspmx.l.google.com. 5 aspmx.l.google.com. 1 aspmx2.googlemail.com. 10 aspmx3.googlemail.com. 10], expected [alt1.aspmx.l.google.com. 5 alt2.aspmx.l.google.com. 5 aspmx.l.google.com. 1]"
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/dns-fail/dns:NS/flanksource.com@8.8.8.8:53",
      type: "dns",
      name: "demo/dns-fail",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "dns-fail",
      description: "",
      endpoint: "NS/flanksource.com@8.8.8.8:53",
      uptime: { passed: 0, failed: 354 },
      latency: { rolling1h: 16 },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:54:24Z",
          duration: 12,
          message: "",
          error:
            "NS flanksource.com on 8.8.8.8: Got [ns-1450.awsdns-53.org. ns-1896.awsdns-45.co.uk. ns-908.awsdns-49.net. ns-91.awsdns-11.com.], expected [ns-91.awsdns-11.com.]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:54Z",
          duration: 13,
          message: "",
          error:
            "NS flanksource.com on 8.8.8.8: Got [ns-1450.awsdns-53.org. ns-1896.awsdns-45.co.uk. ns-908.awsdns-49.net. ns-91.awsdns-11.com.], expected [ns-91.awsdns-11.com.]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-10-29T05:53:24Z",
          duration: 12,
          message: "",
          error:
            "NS flanksource.com on 8.8.8.8: Got [ns-1450.awsdns-53.org. ns-1896.awsdns-45.co.uk. ns-908.awsdns-49.net. ns-91.awsdns-11.com.], expected [ns-91.awsdns-11.com.]"
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/redis-fail/redis:The redis fail test",
      type: "redis",
      name: "demo/redis-fail",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "redis-fail",
      description: "The redis fail test",
      endpoint: "redis.default--namespace:32004",
      uptime: { passed: 0, failed: 353 },
      latency: { rolling1h: 139 },
      checkStatuses: null,
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/mssql-pass/mssql:server=mssql.default.svc;user id=$(username);password=###;port=1433;database=master",
      type: "mssql",
      name: "demo/mssql-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "mssql-pass",
      description: "",
      endpoint:
        "server=mssql.default.svc;user id=$(username);password=###;port=1433;database=master",
      uptime: { passed: 0, failed: 3 },
      latency: { rolling1h: 59 },
      checkStatuses: null,
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    },
    {
      key: "demo/pod-fail/pod:fail",
      type: "pod",
      name: "demo/pod-fail",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "pod-fail",
      description: "",
      endpoint: "fail",
      uptime: { passed: 0, failed: 37 },
      latency: { rolling1h: 114 },
      checkStatuses: null,
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    }
  ]
};
