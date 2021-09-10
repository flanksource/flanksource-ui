export const testData = {
  checks: [
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
      uptime: {
        passed: 0,
        failed: 2432
      },
      latency: {
        rolling1h: 31
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:08Z",
          duration: 22,
          message: "",
          error:
            "A 1.2.3.4.nip.io on 8.8.8.8: Got [1.2.3.4], expected [8.8.8.8]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:38Z",
          duration: 2,
          message: "",
          error:
            "A 1.2.3.4.nip.io on 8.8.8.8: Got [1.2.3.4], expected [8.8.8.8]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:08Z",
          duration: 9,
          message: "",
          error:
            "A 1.2.3.4.nip.io on 8.8.8.8: Got [1.2.3.4], expected [8.8.8.8]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:38Z",
          duration: 23,
          message: "",
          error:
            "A 1.2.3.4.nip.io on 8.8.8.8: Got [1.2.3.4], expected [8.8.8.8]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:08Z",
          duration: 7,
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
      key: "demo/ldap-pass/ldap:ldap://apacheds.ldap.svc:10389",
      type: "ldap",
      name: "demo/ldap-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "ldap-pass",
      description: "",
      endpoint: "ldap://apacheds.ldap.svc:10389",
      uptime: {
        passed: 0,
        failed: 4860
      },
      latency: {
        rolling1h: 0
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:34Z",
          duration: 0,
          message:
            'Failed to connect LDAP Result Code 200 "Network Error": dial tcp 172.20.110.203:10389: connect: connection refused'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:34Z",
          duration: 0,
          message:
            'Failed to connect LDAP Result Code 200 "Network Error": dial tcp 172.20.110.203:10389: connect: connection refused'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:04Z",
          duration: 0,
          message:
            'Failed to connect LDAP Result Code 200 "Network Error": dial tcp 172.20.110.203:10389: connect: connection refused'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:04Z",
          duration: 0,
          message:
            'Failed to connect LDAP Result Code 200 "Network Error": dial tcp 172.20.110.203:10389: connect: connection refused'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:34Z",
          duration: 0,
          message:
            'Failed to connect LDAP Result Code 200 "Network Error": dial tcp 172.20.110.203:10389: connect: connection refused'
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
      key: "demo/junit-pass/junit:jes",
      type: "junit",
      name: "demo/junit-pass",
      namespace: "demo",
      labels: {
        DBAdmin: "true",
        high: "true",
        test: "istest"
      },
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
      uptime: {
        passed: 0,
        failed: 0
      },
      latency: {
        rolling1h: 0
      },
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
      labels: {},
      runnerLabels: null,
      canaryName: "dns-fail",
      description: "",
      endpoint: "CNAME/dns.google@8.8.8.8:53",
      uptime: {
        passed: 0,
        failed: 2432
      },
      latency: {
        rolling1h: 41
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:08Z",
          duration: 37,
          message: "",
          error:
            "CNAME dns.google on 8.8.8.8: Got [dns.google.], expected [wrong.google.]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:38Z",
          duration: 35,
          message: "",
          error:
            "CNAME dns.google on 8.8.8.8: Got [dns.google.], expected [wrong.google.]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:08Z",
          duration: 33,
          message: "",
          error:
            "CNAME dns.google on 8.8.8.8: Got [dns.google.], expected [wrong.google.]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:38Z",
          duration: 35,
          message: "",
          error:
            "CNAME dns.google on 8.8.8.8: Got [dns.google.], expected [wrong.google.]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:08Z",
          duration: 34,
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
      key: "demo/docker-push-fail/dockerPush:ttl.sh/flanksource-busybox:not-found-tag",
      type: "dockerPush",
      name: "demo/docker-push-fail",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "docker-push-fail",
      description: "",
      endpoint: "ttl.sh/flanksource-busybox:not-found-tag",
      uptime: {
        passed: 0,
        failed: 2440
      },
      latency: {
        rolling1h: 0
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:12Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: ttl.sh/flanksource-busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:42Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: ttl.sh/flanksource-busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:12Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: ttl.sh/flanksource-busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:42Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: ttl.sh/flanksource-busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:12Z",
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
      key: "demo/containerd-pull-pass/containerdPull:docker.io/library/busybox:1.31.1",
      type: "containerdPull",
      name: "demo/containerd-pull-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "containerd-pull-pass",
      description: "",
      endpoint: "docker.io/library/busybox:1.31.1",
      uptime: {
        passed: 0,
        failed: 2451
      },
      latency: {
        rolling1h: 0
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:12Z",
          duration: 0,
          message:
            'failed to dial "/run/containerd/containerd.sock": context deadline exceeded'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:42Z",
          duration: 0,
          message:
            'failed to dial "/run/containerd/containerd.sock": context deadline exceeded'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:12Z",
          duration: 0,
          message:
            'failed to dial "/run/containerd/containerd.sock": context deadline exceeded'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:42Z",
          duration: 0,
          message:
            'failed to dial "/run/containerd/containerd.sock": context deadline exceeded'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:12Z",
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
      key: "demo/pod-fail/pod:fail",
      type: "pod",
      name: "demo/pod-fail",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "pod-fail",
      description: "",
      endpoint: "fail",
      uptime: {
        passed: 0,
        failed: 2084
      },
      latency: {
        rolling1h: 0
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:09Z",
          duration: 0,
          message:
            "unexpected error unable to fetch pod details: timeout exceeded waiting for hello-world-fail-1 is Pending, error: <nil>"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:39Z",
          duration: 0,
          message:
            "unexpected error unable to fetch pod details: timeout exceeded waiting for hello-world-fail-1 is Pending, error: <nil>"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:09Z",
          duration: 0,
          message:
            "unexpected error unable to fetch pod details: timeout exceeded waiting for hello-world-fail-1 is Pending, error: <nil>"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:39Z",
          duration: 0,
          message:
            "unexpected error unable to fetch pod details: timeout exceeded waiting for hello-world-fail-1 is Pending, error: <nil>"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:09Z",
          duration: 0,
          message:
            "unexpected error unable to fetch pod details: timeout exceeded waiting for hello-world-fail-1 is Pending, error: <nil>"
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
      uptime: {
        passed: 0,
        failed: 0
      },
      latency: {
        rolling1h: 0
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-06T14:04:09Z",
          duration: 31485,
          message: "request timeout exceeded 0ms > 7000"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-06T14:00:13Z",
          duration: 32182,
          message: "request timeout exceeded 0ms > 7000"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-06T13:58:11Z",
          duration: 84,
          message: "",
          error:
            'Pod "hello-world-ruby-1" is invalid: spec: Forbidden: pod updates may not change fields other than `spec.containers[*].image`, `spec.initContainers[*].image`, `spec.activeDeadlineSeconds` or `spec.tolerations` (only additions to existing tolerations)\n  core.PodSpec{\n- \tVolumes: nil,\n+ \tVolumes: []core.Volume{\n+ \t\t{\n+ \t\t\tName:         "default-token-wppdg",\n+ \t\t\tVolumeSource: core.VolumeSource{Secret: &core.SecretVolumeSource{...}},\n+ \t\t},\n+ \t},\n  \tInitContainers: nil,\n  \tContainers: []core.Container{\n  \t\t{\n  \t\t\t... // 7 identical fields\n  \t\t\tEnv:          nil,\n  \t\t\tResources:    {},\n- \t\t\tVolumeMounts: nil,\n+ \t\t\tVolumeMounts: []core.VolumeMount{\n+ \t\t\t\t{\n+ \t\t\t\t\tName:      "default-token-wppdg",\n+ \t\t\t\t\tReadOnly:  true,\n+ \t\t\t\t\tMountPath: "/var/run/secrets/kubernetes.io/serviceaccount",\n+ \t\t\t\t},\n+ \t\t\t},\n  \t\t\tVolumeDevices: nil,\n  \t\t\tLivenessProbe: nil,\n  \t\t\t... // 10 identical fields\n  \t\t},\n  \t},\n  \tEphemeralContainers: nil,\n  \tRestartPolicy:       "Always",\n  \t... // 2 identical fields\n  \tDNSPolicy:                    "ClusterFirst",\n  \tNodeSelector:                 {"kubernetes.io/hostname": "ip-10-0-6-76.eu-west-2.compute.internal"},\n- \tServiceAccountName:           "",\n+ \tServiceAccountName:           "default",\n  \tAutomountServiceAccountToken: nil,\n- \tNodeName:                     "",\n+ \tNodeName:                     "ip-10-0-6-76.eu-west-2.compute.internal",\n  \tSecurityContext:              &{},\n- \tImagePullSecrets:             nil,\n+ \tImagePullSecrets:             []core.LocalObjectReference{{Name: "dockerhub"}},\n  \tHostname:                     "",\n  \tSubdomain:                    "",\n  \t... // 14 identical fields\n  }\n'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-06T13:56:14Z",
          duration: 33151,
          message: "request timeout exceeded 0ms > 7000"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-06T13:53:44Z",
          duration: 33148,
          message: "request timeout exceeded 0ms > 7000"
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
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "postgres-fail",
      description: "",
      endpoint: "user=$(username) dbname=pqgotest sslmode=verify-full",
      uptime: {
        passed: 0,
        failed: 0
      },
      latency: {
        rolling1h: 0
      },
      checkStatuses: null,
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
      uptime: {
        passed: 0,
        failed: 2432
      },
      latency: {
        rolling1h: 49
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:08Z",
          duration: 38,
          message: "",
          error:
            "MX flanksource.com on 8.8.8.8: Got [alt1.aspmx.l.google.com. 5 alt2.aspmx.l.google.com. 5 aspmx.l.google.com. 1 aspmx2.googlemail.com. 10 aspmx3.googlemail.com. 10], expected [alt1.aspmx.l.google.com. 5 alt2.aspmx.l.google.com. 5 aspmx.l.google.com. 1]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:38Z",
          duration: 40,
          message: "",
          error:
            "MX flanksource.com on 8.8.8.8: Got [alt1.aspmx.l.google.com. 5 alt2.aspmx.l.google.com. 5 aspmx.l.google.com. 1 aspmx2.googlemail.com. 10 aspmx3.googlemail.com. 10], expected [alt1.aspmx.l.google.com. 5 alt2.aspmx.l.google.com. 5 aspmx.l.google.com. 1]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:08Z",
          duration: 34,
          message: "",
          error:
            "MX flanksource.com on 8.8.8.8: Got [alt1.aspmx.l.google.com. 5 alt2.aspmx.l.google.com. 5 aspmx.l.google.com. 1 aspmx2.googlemail.com. 10 aspmx3.googlemail.com. 10], expected [alt1.aspmx.l.google.com. 5 alt2.aspmx.l.google.com. 5 aspmx.l.google.com. 1]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:38Z",
          duration: 40,
          message: "",
          error:
            "MX flanksource.com on 8.8.8.8: Got [alt1.aspmx.l.google.com. 5 alt2.aspmx.l.google.com. 5 aspmx.l.google.com. 1 aspmx2.googlemail.com. 10 aspmx3.googlemail.com. 10], expected [alt1.aspmx.l.google.com. 5 alt2.aspmx.l.google.com. 5 aspmx.l.google.com. 1]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:08Z",
          duration: 40,
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
      key: "demo/dns-pass/dns:PTR/8.8.8.8@8.8.8.8:53",
      type: "dns",
      name: "demo/dns-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "dns-pass",
      description: "",
      endpoint: "PTR/8.8.8.8@8.8.8.8:53",
      uptime: {
        passed: 2459,
        failed: 0
      },
      latency: {
        rolling1h: 2
      },
      checkStatuses: [
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:19:09Z",
          duration: 1,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:39Z",
          duration: 1,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:09Z",
          duration: 2,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:17:39Z",
          duration: 1,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:17:09Z",
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
      key: "demo/docker-fail/dockerPull:docker.io/library/busybox:random",
      type: "dockerPull",
      name: "demo/docker-fail",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "docker-fail",
      description: "",
      endpoint: "docker.io/library/busybox:random",
      uptime: {
        passed: 0,
        failed: 872
      },
      latency: {
        rolling1h: 1885.9
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:12Z",
          duration: 1858,
          message: "",
          error:
            "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:42Z",
          duration: 1868,
          message: "",
          error:
            "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:12Z",
          duration: 1862,
          message: "",
          error:
            "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:42Z",
          duration: 1858,
          message: "",
          error:
            "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:12Z",
          duration: 1857,
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
      key: "demo/http-fail-timeout/http:http://httpstat.us/200?sleep=200",
      type: "http",
      name: "demo/http-fail-timeout",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "http-fail-timeout",
      description: "",
      endpoint: "http://httpstat.us/200?sleep=200",
      uptime: {
        passed: 0,
        failed: 1194
      },
      latency: {
        rolling1h: 619.8
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:15Z",
          duration: 381,
          message: "",
          error: "threshold exceeded 381ms > 100"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:45Z",
          duration: 371,
          message: "",
          error: "threshold exceeded 371ms > 100"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:15Z",
          duration: 368,
          message: "",
          error: "threshold exceeded 368ms > 100"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:45Z",
          duration: 377,
          message: "",
          error: "threshold exceeded 377ms > 100"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:15Z",
          duration: 366,
          message: "",
          error: "threshold exceeded 366ms > 100"
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
      labels: {},
      runnerLabels: null,
      canaryName: "http-pass",
      description: "",
      endpoint: "http://status.savanttools.com/?code=500",
      uptime: {
        passed: 2437,
        failed: 0
      },
      latency: {
        rolling1h: 158
      },
      checkStatuses: [
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:19:30Z",
          duration: 155,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:19:00Z",
          duration: 154,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:30Z",
          duration: 153,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:00Z",
          duration: 154,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:17:30Z",
          duration: 153,
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
      key: "demo/dns-fail/dns:NS/flanksource.com@8.8.8.8:53",
      type: "dns",
      name: "demo/dns-fail",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "dns-fail",
      description: "",
      endpoint: "NS/flanksource.com@8.8.8.8:53",
      uptime: {
        passed: 0,
        failed: 2432
      },
      latency: {
        rolling1h: 46
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:08Z",
          duration: 40,
          message: "",
          error:
            "NS flanksource.com on 8.8.8.8: Got [ns-1450.awsdns-53.org. ns-1896.awsdns-45.co.uk. ns-908.awsdns-49.net. ns-91.awsdns-11.com.], expected [ns-91.awsdns-11.com.]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:38Z",
          duration: 31,
          message: "",
          error:
            "NS flanksource.com on 8.8.8.8: Got [ns-1450.awsdns-53.org. ns-1896.awsdns-45.co.uk. ns-908.awsdns-49.net. ns-91.awsdns-11.com.], expected [ns-91.awsdns-11.com.]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:08Z",
          duration: 28,
          message: "",
          error:
            "NS flanksource.com on 8.8.8.8: Got [ns-1450.awsdns-53.org. ns-1896.awsdns-45.co.uk. ns-908.awsdns-49.net. ns-91.awsdns-11.com.], expected [ns-91.awsdns-11.com.]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:38Z",
          duration: 41,
          message: "",
          error:
            "NS flanksource.com on 8.8.8.8: Got [ns-1450.awsdns-53.org. ns-1896.awsdns-45.co.uk. ns-908.awsdns-49.net. ns-91.awsdns-11.com.], expected [ns-91.awsdns-11.com.]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:08Z",
          duration: 33,
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
      key: "demo/docker-fail/dockerPull:docker.io/busybox",
      type: "dockerPull",
      name: "demo/docker-fail",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "docker-fail",
      description: "",
      endpoint: "docker.io/busybox",
      uptime: {
        passed: 0,
        failed: 872
      },
      latency: {
        rolling1h: 2837
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:12Z",
          duration: 2796,
          message: "",
          error:
            "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:42Z",
          duration: 2799,
          message: "",
          error:
            "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:12Z",
          duration: 2799,
          message: "",
          error:
            "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:42Z",
          duration: 2814,
          message: "",
          error:
            "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:12Z",
          duration: 2791,
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
      key: "demo/docker-pass/dockerPull:docker.io/library/busybox:1.31.1@sha256:b20c55f6bfac8828690ec2f4e2da29790c80aa3d7801a119f0ea6b045d2d2da1",
      type: "dockerPull",
      name: "demo/docker-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "docker-pass",
      description: "",
      endpoint:
        "docker.io/library/busybox:1.31.1@sha256:b20c55f6bfac8828690ec2f4e2da29790c80aa3d7801a119f0ea6b045d2d2da1",
      uptime: {
        passed: 0,
        failed: 2256
      },
      latency: {
        rolling1h: 945
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:11Z",
          duration: 933,
          message: "",
          error:
            "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:41Z",
          duration: 931,
          message: "",
          error:
            "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:11Z",
          duration: 941,
          message: "",
          error:
            "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:41Z",
          duration: 933,
          message: "",
          error:
            "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:11Z",
          duration: 929,
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
      namespace: "demo",
      labels: {
        DBAdmin: "true",
        high: "true"
      },
      runnerLabels: null,
      canaryName: "junit-fail",
      description: "",
      endpoint: "jes",
      uptime: {
        passed: 0,
        failed: 232
      },
      latency: {
        rolling1h: 50506
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:50Z",
          duration: 50506,
          message: "",
          error:
            'error executing template ✅ {{.results.passed}} ❌ {{.results.failed}} in 🕑 {{.results.duration}}: template: :1:14: executing "" at <.results.passed>: can\'t evaluate field passed in type interface {}'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:15:50Z",
          duration: 50506,
          message: "",
          error:
            'error executing template ✅ {{.results.passed}} ❌ {{.results.failed}} in 🕑 {{.results.duration}}: template: :1:14: executing "" at <.results.passed>: can\'t evaluate field passed in type interface {}'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:13:50Z",
          duration: 50506,
          message: "",
          error:
            'error executing template ✅ {{.results.passed}} ❌ {{.results.failed}} in 🕑 {{.results.duration}}: template: :1:14: executing "" at <.results.passed>: can\'t evaluate field passed in type interface {}'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:11:50Z",
          duration: 50506,
          message: "",
          error:
            'error executing template ✅ {{.results.passed}} ❌ {{.results.failed}} in 🕑 {{.results.duration}}: template: :1:14: executing "" at <.results.passed>: can\'t evaluate field passed in type interface {}'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:09:50Z",
          duration: 50506,
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
      key: "demo/namespace-pass/namespace:check",
      type: "namespace",
      name: "demo/namespace-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "namespace-pass",
      description: "",
      endpoint: "check",
      uptime: {
        passed: 0,
        failed: 1757
      },
      latency: {
        rolling1h: 11203
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:11Z",
          duration: 0,
          message:
            'unexpected error unable to create namespace: namespaces "test-foo-4" already exists'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:41Z",
          duration: 0,
          message:
            'unexpected error unable to create namespace: namespaces "test-foo-3" already exists'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:11Z",
          duration: 0,
          message:
            'unexpected error unable to create namespace: namespaces "test-foo-2" already exists'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:52Z",
          duration: 11176,
          message: "ingress timeout exceeded 10083ms > 10000"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:11Z",
          duration: 0,
          message:
            'unexpected error unable to create namespace: namespaces "test-foo-0" already exists'
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
      key: "demo/docker-push-fail/dockerPush:docker.io/flanksource/busybox:1.30",
      type: "dockerPush",
      name: "demo/docker-push-fail",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "docker-push-fail",
      description: "",
      endpoint: "docker.io/flanksource/busybox:1.30",
      uptime: {
        passed: 0,
        failed: 2440
      },
      latency: {
        rolling1h: 0
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:12Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: flanksource/busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:42Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: flanksource/busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:12Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: flanksource/busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:42Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: flanksource/busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:12Z",
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
      key: "demo/mongo/dns:/mongo.default.svc",
      type: "dns",
      name: "demo/mongo",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "mongo",
      description: "",
      endpoint: "/mongo.default.svc",
      uptime: {
        passed: 2437,
        failed: 0
      },
      latency: {
        rolling1h: 3
      },
      checkStatuses: [
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:19:33Z",
          duration: 1,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:19:03Z",
          duration: 1,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:33Z",
          duration: 1,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:03Z",
          duration: 2,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:17:33Z",
          duration: 4,
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
      key: "demo/mssql-fail/mssql:server=mssql.platformsystem;user id=sa;password=###;port=32010;database=master",
      type: "mssql",
      name: "demo/mssql-fail",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "mssql-fail",
      description: "",
      endpoint:
        "server=mssql.platformsystem;user id=sa;password=###;port=32010;database=master",
      uptime: {
        passed: 0,
        failed: 2
      },
      latency: {
        rolling1h: 13
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:34Z",
          duration: 10,
          message: "",
          error:
            "failed to query db: lookup mssql.platformsystem on 172.20.0.10:53: no such host"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:04Z",
          duration: 13,
          message: "",
          error:
            "failed to query db: lookup mssql.platformsystem on 172.20.0.10:53: no such host"
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
      uptime: {
        passed: 2436,
        failed: 0
      },
      latency: {
        rolling1h: 11
      },
      checkStatuses: [
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:19:10Z",
          duration: 2,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:40Z",
          duration: 3,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:10Z",
          duration: 7,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:17:40Z",
          duration: 4,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:17:10Z",
          duration: 6,
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
      uptime: {
        passed: 2459,
        failed: 0
      },
      latency: {
        rolling1h: 50
      },
      checkStatuses: [
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:19:09Z",
          duration: 39,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:39Z",
          duration: 38,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:09Z",
          duration: 40,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:17:39Z",
          duration: 38,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:17:09Z",
          duration: 40,
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
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "docker-fail",
      description: "",
      endpoint: "docker.io/library/busybox:1.31.1",
      uptime: {
        passed: 0,
        failed: 872
      },
      latency: {
        rolling1h: 943.9
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:12Z",
          duration: 930,
          message: "",
          error:
            "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:42Z",
          duration: 932,
          message: "",
          error:
            "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:12Z",
          duration: 932,
          message: "",
          error:
            "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:42Z",
          duration: 928,
          message: "",
          error:
            "Failed to pull image: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:12Z",
          duration: 928,
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
      key: "demo/http-pass/http:http://status.savanttools.com/?code=404",
      type: "http",
      name: "demo/http-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "http-pass",
      description: "",
      endpoint: "http://status.savanttools.com/?code=404",
      uptime: {
        passed: 2437,
        failed: 0
      },
      latency: {
        rolling1h: 159.6500000000001
      },
      checkStatuses: [
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:19:30Z",
          duration: 153,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:19:00Z",
          duration: 153,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:30Z",
          duration: 154,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:00Z",
          duration: 154,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:17:30Z",
          duration: 153,
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
      uptime: {
        passed: 0,
        failed: 31
      },
      latency: {
        rolling1h: 19.849999999999998
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:38Z",
          duration: 6,
          message: "",
          error:
            'failed to query db: pq: password authentication failed for user "$(username)"'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:08Z",
          duration: 3,
          message: "",
          error:
            'failed to query db: pq: password authentication failed for user "$(username)"'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:38Z",
          duration: 4,
          message: "",
          error:
            'failed to query db: pq: password authentication failed for user "$(username)"'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:08Z",
          duration: 3,
          message: "",
          error:
            'failed to query db: pq: password authentication failed for user "$(username)"'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:38Z",
          duration: 4,
          message: "",
          error:
            'failed to query db: pq: password authentication failed for user "$(username)"'
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
      key: "demo/pod-pass/pod:golang",
      type: "pod",
      name: "demo/pod-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "pod-pass",
      description: "",
      endpoint: "golang",
      uptime: {
        passed: 0,
        failed: 0
      },
      latency: {
        rolling1h: 0
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-06T14:04:09Z",
          duration: 31596,
          message: "",
          error:
            'Pod "hello-world-golang-1" is invalid: spec: Forbidden: pod updates may not change fields other than `spec.containers[*].image`, `spec.initContainers[*].image`, `spec.activeDeadlineSeconds` or `spec.tolerations` (only additions to existing tolerations)\n  core.PodSpec{\n- \tVolumes: nil,\n+ \tVolumes: []core.Volume{\n+ \t\t{\n+ \t\t\tName:         "default-token-wppdg",\n+ \t\t\tVolumeSource: core.VolumeSource{Secret: &core.SecretVolumeSource{...}},\n+ \t\t},\n+ \t},\n  \tInitContainers: nil,\n  \tContainers: []core.Container{\n  \t\t{\n  \t\t\t... // 7 identical fields\n  \t\t\tEnv:          nil,\n  \t\t\tResources:    {},\n- \t\t\tVolumeMounts: nil,\n+ \t\t\tVolumeMounts: []core.VolumeMount{\n+ \t\t\t\t{\n+ \t\t\t\t\tName:      "default-token-wppdg",\n+ \t\t\t\t\tReadOnly:  true,\n+ \t\t\t\t\tMountPath: "/var/run/secrets/kubernetes.io/serviceaccount",\n+ \t\t\t\t},\n+ \t\t\t},\n  \t\t\tVolumeDevices: nil,\n  \t\t\tLivenessProbe: nil,\n  \t\t\t... // 10 identical fields\n  \t\t},\n  \t},\n  \tEphemeralContainers: nil,\n  \tRestartPolicy:       "Always",\n  \t... // 2 identical fields\n  \tDNSPolicy:                    "ClusterFirst",\n  \tNodeSelector:                 {"kubernetes.io/hostname": "ip-10-0-6-76.eu-west-2.compute.internal"},\n- \tServiceAccountName:           "",\n+ \tServiceAccountName:           "default",\n  \tAutomountServiceAccountToken: nil,\n- \tNodeName:                     "",\n+ \tNodeName:                     "ip-10-0-6-76.eu-west-2.compute.internal",\n  \tSecurityContext:              &{},\n- \tImagePullSecrets:             nil,\n+ \tImagePullSecrets:             []core.LocalObjectReference{{Name: "dockerhub"}},\n  \tHostname:                     "",\n  \tSubdomain:                    "",\n  \t... // 14 identical fields\n  }\n'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-06T14:00:13Z",
          duration: 0,
          message:
            'unexpected error failed to delete pod: pods "hello-world-golang-1" not found'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-06T13:58:11Z",
          duration: 63202,
          message: "request timeout exceeded 0ms > 7000"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-06T13:56:14Z",
          duration: 0,
          message:
            'unexpected error failed to delete pod: pods "hello-world-golang-1" not found'
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-06T13:53:44Z",
          duration: 0,
          message:
            'unexpected error failed to delete pod: pods "hello-world-golang-1" not found'
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
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "dns-fail",
      description: "",
      endpoint: "PTR/8.8.8.8@8.8.8.8:53",
      uptime: {
        passed: 0,
        failed: 2432
      },
      latency: {
        rolling1h: 2
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:08Z",
          duration: 2,
          message: "",
          error: "PTR 8.8.8.8 on 8.8.8.8: returned 1 results, expecting 10"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:38Z",
          duration: 1,
          message: "",
          error: "PTR 8.8.8.8 on 8.8.8.8: returned 1 results, expecting 10"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:08Z",
          duration: 1,
          message: "",
          error: "PTR 8.8.8.8 on 8.8.8.8: returned 1 results, expecting 10"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:38Z",
          duration: 2,
          message: "",
          error: "PTR 8.8.8.8 on 8.8.8.8: returned 1 results, expecting 10"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:08Z",
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
      key: "demo/dns-fail/dns:TXT/flanksource.com@8.8.8.8:53",
      type: "dns",
      name: "demo/dns-fail",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "dns-fail",
      description: "",
      endpoint: "TXT/flanksource.com@8.8.8.8:53",
      uptime: {
        passed: 0,
        failed: 2432
      },
      latency: {
        rolling1h: 50
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:08Z",
          duration: 40,
          message: "",
          error:
            "TXT flanksource.com on 8.8.8.8: returned 1 results, expecting 5"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:38Z",
          duration: 46,
          message: "",
          error:
            "TXT flanksource.com on 8.8.8.8: returned 1 results, expecting 5"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:08Z",
          duration: 40,
          message: "",
          error:
            "TXT flanksource.com on 8.8.8.8: returned 1 results, expecting 5"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:38Z",
          duration: 39,
          message: "",
          error:
            "TXT flanksource.com on 8.8.8.8: returned 1 results, expecting 5"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:08Z",
          duration: 40,
          message: "",
          error:
            "TXT flanksource.com on 8.8.8.8: returned 1 results, expecting 5"
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
      uptime: {
        passed: 2459,
        failed: 0
      },
      latency: {
        rolling1h: 31
      },
      checkStatuses: [
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:19:09Z",
          duration: 21,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:39Z",
          duration: 7,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:09Z",
          duration: 8,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:17:39Z",
          duration: 2,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:17:09Z",
          duration: 28,
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
      key: "demo/dns-pass/dns:MX/flanksource.com@8.8.8.8:53",
      type: "dns",
      name: "demo/dns-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "dns-pass",
      description: "",
      endpoint: "MX/flanksource.com@8.8.8.8:53",
      uptime: {
        passed: 2459,
        failed: 0
      },
      latency: {
        rolling1h: 49
      },
      checkStatuses: [
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:19:09Z",
          duration: 40,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:39Z",
          duration: 41,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:09Z",
          duration: 39,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:17:39Z",
          duration: 40,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:17:09Z",
          duration: 47,
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
      key: "demo/http-pass/http:http://status.savanttools.com/?code=200",
      type: "http",
      name: "demo/http-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "http-pass",
      description: "",
      endpoint: "http://status.savanttools.com/?code=200",
      uptime: {
        passed: 2437,
        failed: 0
      },
      latency: {
        rolling1h: 171
      },
      checkStatuses: [
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:19:30Z",
          duration: 156,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:19:00Z",
          duration: 174,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:30Z",
          duration: 155,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:00Z",
          duration: 154,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:17:30Z",
          duration: 154,
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
      key: "demo/dns-pass/dns:CNAME/dns.google@8.8.8.8:53",
      type: "dns",
      name: "demo/dns-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "dns-pass",
      description: "",
      endpoint: "CNAME/dns.google@8.8.8.8:53",
      uptime: {
        passed: 2459,
        failed: 0
      },
      latency: {
        rolling1h: 41
      },
      checkStatuses: [
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:19:09Z",
          duration: 35,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:39Z",
          duration: 35,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:09Z",
          duration: 34,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:17:39Z",
          duration: 33,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:17:09Z",
          duration: 37,
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
      labels: {},
      runnerLabels: null,
      canaryName: "dns-pass",
      description: "",
      endpoint: "NS/flanksource.com@8.8.8.8:53",
      uptime: {
        passed: 2459,
        failed: 0
      },
      latency: {
        rolling1h: 46
      },
      checkStatuses: [
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:19:09Z",
          duration: 44,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:39Z",
          duration: 34,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:18:09Z",
          duration: 41,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:17:39Z",
          duration: 35,
          message: ""
        },
        {
          status: true,
          invalid: false,
          time: "2021-09-07T07:17:09Z",
          duration: 40,
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
      key: "demo/docker-push0-pass/dockerPush:ttl.sh/flanksource-busybox:1.30",
      type: "dockerPush",
      name: "demo/docker-push0-pass",
      namespace: "demo",
      labels: {},
      runnerLabels: null,
      canaryName: "docker-push0-pass",
      description: "",
      endpoint: "ttl.sh/flanksource-busybox:1.30",
      uptime: {
        passed: 0,
        failed: 2460
      },
      latency: {
        rolling1h: 0
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:13Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: ttl.sh/flanksource-busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:43Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: ttl.sh/flanksource-busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:13Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: ttl.sh/flanksource-busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:43Z",
          duration: 0,
          message:
            "Failed to push An image does not exist locally with the tag: ttl.sh/flanksource-busybox"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:13Z",
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
      uptime: {
        passed: 0,
        failed: 2460
      },
      latency: {
        rolling1h: 162
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:14Z",
          duration: 157,
          message: "",
          error: "response code invalid 500 != [200]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:44Z",
          duration: 153,
          message: "",
          error: "response code invalid 500 != [200]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:14Z",
          duration: 162,
          message: "",
          error: "response code invalid 500 != [200]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:44Z",
          duration: 153,
          message: "",
          error: "response code invalid 500 != [200]"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:14Z",
          duration: 154,
          message: "",
          error: "response code invalid 500 != [200]"
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
      uptime: {
        passed: 0,
        failed: 2454
      },
      latency: {
        rolling1h: 138
      },
      checkStatuses: [
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:35Z",
          duration: 98,
          message: "",
          error:
            "failed to execute query dial tcp: lookup redis.default--namespace on 172.20.0.10:53: no such host"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:19:05Z",
          duration: 113,
          message: "",
          error:
            "failed to execute query dial tcp: lookup redis.default--namespace on 172.20.0.10:53: no such host"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:35Z",
          duration: 92,
          message: "",
          error:
            "failed to execute query dial tcp: lookup redis.default--namespace on 172.20.0.10:53: no such host"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:18:05Z",
          duration: 115,
          message: "",
          error:
            "failed to execute query dial tcp: lookup redis.default--namespace on 172.20.0.10:53: no such host"
        },
        {
          status: false,
          invalid: false,
          time: "2021-09-07T07:17:35Z",
          duration: 88,
          message: "",
          error:
            "failed to execute query dial tcp: lookup redis.default--namespace on 172.20.0.10:53: no such host"
        }
      ],
      interval: 30,
      schedule: "",
      owner: "",
      severity: "",
      icon: "",
      displayType: ""
    }
  ]
};
