export const MOCK_DATA = [
  {
    id: "0181ebeb-b9e7-009b-a28d-72c2e6d13f1b",
    config_type: "JIRA",
    external_id: "JIRA",
    name: "Jira Projects",
    tags: {},
    config: {
      projects: {
        Project2: {
          name: "A Different project",
          priorities: ["P1", "P2", "P3"],
          issueTypes: {
            defect: {
              status: ["open", "close", "resolved"]
            },
            task: {
              status: ["open", "close", "resolved"]
            },
            feat: {
              status: ["open", "close", "resolved"]
            }
          }
        },
        TEST: {
          name: "Test Project",
          icon: "ABC",
          priorities: ["High", "Med", "Low"],
          issueTypes: {
            task: {
              status: ["open", "close", "resolved"],
              fields: ["custom field"]
            }
          }
        }
      }
    }
  },
  {
    id: "0181ebeb-b9e7-009b-a28d-72c2e6d13f1b",
    scraper_id: null,
    config_type: "Subnet",
    external_id: "subnet-8ed885f5",
    name: "",
    namespace: null,
    description: null,
    account: "745897381572",
    region: "eu-west-2",
    zone: "eu-west-2a",
    network: "vpc-f3c6e49a",
    subnet: "subnet-8ed885f5",
    config: {
      Tags: null,
      State: "available",
      VpcId: "vpc-f3c6e49a",
      OwnerId: "745897381572",
      SubnetId: "subnet-8ed885f5",
      CidrBlock: "172.31.0.0/20",
      SubnetArn: "arn:aws:ec2:eu-west-2:745897381572:subnet/subnet-8ed885f5",
      Ipv6Native: false,
      OutpostArn: null,
      EnableDns64: false,
      DefaultForAz: true,
      AvailabilityZone: "eu-west-2a",
      AvailabilityZoneId: "euw2-az2",
      MapPublicIpOnLaunch: true,
      CustomerOwnedIpv4Pool: null,
      EnableLniAtDeviceIndex: null,
      AvailableIpAddressCount: 4091,
      MapCustomerOwnedIpOnLaunch: false,
      AssignIpv6AddressOnCreation: false,
      Ipv6CidrBlockAssociationSet: [],
      PrivateDnsNameOptionsOnLaunch: {
        HostnameType: "ip-name",
        EnableResourceNameDnsARecord: false,
        EnableResourceNameDnsAAAARecord: false
      }
    },
    created_at: "0001-01-01T00:00:00",
    updated_at: "2022-07-26T13:16:25.927422",
    source: "",
    tags: {}
  },
  {
    id: "0181ebeb-b9fe-0f2d-951e-0463fed6a370",
    scraper_id: null,
    config_type: "EC2Instance",
    external_id: "i-05885b04545c37f14",
    name: "flanksource-canary-cluster-ng2-Node",
    namespace: null,
    description: null,
    account: "745897381572",
    region: "eu-west-2",
    zone: "eu-west-2a",
    network: "vpc-0a95bd9951b08bf6a",
    subnet: "subnet-03c20ec3935232b26",
    config: {
      tags: {
        Name: "flanksource-canary-cluster-ng2-Node",
        "aws:ec2launchtemplate:id": "lt-0482435569f922b0b",
        "aws:autoscaling:groupName":
          "eksctl-flanksource-canary-cluster-nodegroup-ng2-NodeGroup-DI24EJRMUAC5",
        "aws:cloudformation:stack-id":
          "arn:aws:cloudformation:eu-west-2:745897381572:stack/eksctl-flanksource-canary-cluster-nodegroup-ng2/a5704a70-0848-11ec-9abc-0664644b2bde",
        "alpha.eksctl.io/cluster-name": "flanksource-canary-cluster",
        "aws:cloudformation:logical-id": "NodeGroup",
        "aws:cloudformation:stack-name":
          "eksctl-flanksource-canary-cluster-nodegroup-ng2",
        "aws:ec2launchtemplate:version": "1",
        "alpha.eksctl.io/eksctl-version": "0.63.0",
        "alpha.eksctl.io/nodegroup-name": "ng2",
        "alpha.eksctl.io/nodegroup-type": "unmanaged",
        "eksctl.io/v1alpha2/nodegroup-name": "ng2",
        "eksctl.cluster.k8s.io/v1alpha1/cluster-name":
          "flanksource-canary-cluster",
        "kubernetes.io/cluster/flanksource-canary-cluster": "owned"
      },
      state: "running",
      vpc_id: "vpc-0a95bd9951b08bf6a",
      image_id: "ami-06de1935f1242d2d8",
      Inventory: {
        AgentType: "amazon-ssm-agent",
        IpAddress: "10.0.4.100",
        InstanceId: "i-05885b04545c37f14",
        CaptureTime: "2022-07-24T21:11:54Z",
        AgentVersion: "3.0.1124.0",
        ComputerName: "ip-10-0-4-100.eu-west-2.compute.internal",
        PlatformName: "Amazon Linux",
        PlatformType: "Linux",
        ResourceType: "EC2Instance",
        InstanceStatus: "Active",
        PlatformVersion: "2"
      },
      subnet_id: "subnet-03c20ec3935232b26",
      Compliance: [
        {
          ID: "ec2-instance-no-public-ip",
          Annotation: "This Amazon EC2 Instance uses a public IP.",
          ComplianceType: "NON_COMPLIANT",
          ResultRecordedTime: "2022-07-24T10:36:33.991Z",
          ConfigRuleInvokedTime: "2022-07-24T10:36:33.756Z"
        }
      ],
      hypervisor: "xen",
      ena_support: true,
      instance_id: "i-05885b04545c37f14",
      launch_time: "2022-07-10T17:49:28Z",
      architecture: "x86_64",
      ebs_optimized: false,
      instance_type: "t3.xlarge",
      public_dns_name: "ec2-52-56-232-84.eu-west-2.compute.amazonaws.com",
      security_groups: {
        "sg-06a33af50d909a0f2":
          "eksctl-flanksource-canary-cluster-nodegroup-ng2-SG-1SMHLEUIZPYHV",
        "sg-06ac6be2517c7a0b1":
          "eksctl-flanksource-canary-cluster-cluster-ClusterSharedNodeSecurityGroup-13FB0A1VPZ8HE",
        "sg-0fbd03f5ffbb7f0eb": "ingress"
      },
      usage_operation: "RunInstances",
      ami_launch_index: 0,
      platform_details: "Linux/UNIX",
      private_dns_name: "ip-10-0-4-100.eu-west-2.compute.internal",
      root_device_name: "/dev/xvda",
      root_device_type: "ebs",
      public_ip_address: "52.56.232.84",
      source_dest_check: true,
      network_interfaces: [
        {
          Groups: [
            "sg-06ac6be2517c7a0b1",
            "sg-06a33af50d909a0f2",
            "sg-0fbd03f5ffbb7f0eb"
          ],
          Status: "in-use",
          OwnerID: "",
          AttachTime: "2022-07-10T17:49:28Z",
          MacAddress: "06:ea:55:73:a5:28",
          Description: "",
          DeviceIndex: 0,
          AttachmentID: "eni-attach-0fc090399f3901f3e",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDNSName: "ip-10-0-4-100.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIPAddress: "10.0.4.100",
          NetworkInterfaceID: "eni-0e7a514fca54e3492",
          PrivateIPAddresses: [
            "10.0.4.100",
            "10.0.4.228",
            "10.0.4.196",
            "10.0.4.231",
            "10.0.4.40",
            "10.0.4.77",
            "10.0.4.173",
            "10.0.4.176",
            "10.0.4.212",
            "10.0.4.151",
            "10.0.4.217",
            "10.0.4.186",
            "10.0.4.124",
            "10.0.4.62",
            "10.0.4.254"
          ],
          DeleteOnTermination: true
        },
        {
          Groups: [
            "sg-06ac6be2517c7a0b1",
            "sg-06a33af50d909a0f2",
            "sg-0fbd03f5ffbb7f0eb"
          ],
          Status: "in-use",
          OwnerID: "",
          AttachTime: "2022-07-10T17:51:02Z",
          MacAddress: "06:01:e3:07:bc:16",
          Description: "aws-K8S-i-05885b04545c37f14",
          DeviceIndex: 1,
          AttachmentID: "eni-attach-037d0e9cf48e00c9a",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDNSName: "ip-10-0-4-13.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIPAddress: "10.0.4.13",
          NetworkInterfaceID: "eni-0425efd769caa53d2",
          PrivateIPAddresses: [
            "10.0.4.13",
            "10.0.4.192",
            "10.0.4.64",
            "10.0.4.69",
            "10.0.4.166",
            "10.0.4.103",
            "10.0.4.168",
            "10.0.4.11",
            "10.0.4.246",
            "10.0.4.216",
            "10.0.4.153",
            "10.0.4.58",
            "10.0.4.187",
            "10.0.4.156",
            "10.0.4.92"
          ],
          DeleteOnTermination: true
        },
        {
          Groups: [
            "sg-06ac6be2517c7a0b1",
            "sg-06a33af50d909a0f2",
            "sg-0fbd03f5ffbb7f0eb"
          ],
          Status: "in-use",
          OwnerID: "",
          AttachTime: "2022-07-11T06:14:15Z",
          MacAddress: "06:9d:7c:9c:19:40",
          Description: "aws-K8S-i-05885b04545c37f14",
          DeviceIndex: 3,
          AttachmentID: "eni-attach-07c64894b238c186d",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDNSName: "ip-10-0-4-50.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIPAddress: "10.0.4.50",
          NetworkInterfaceID: "eni-02a8235082893fc6d",
          PrivateIPAddresses: [
            "10.0.4.50",
            "10.0.4.130",
            "10.0.4.34",
            "10.0.4.141",
            "10.0.4.237",
            "10.0.4.109",
            "10.0.4.80",
            "10.0.4.243",
            "10.0.4.211",
            "10.0.4.118",
            "10.0.4.119",
            "10.0.4.23",
            "10.0.4.248",
            "10.0.4.25",
            "10.0.4.90"
          ],
          DeleteOnTermination: true
        },
        {
          Groups: [
            "sg-06ac6be2517c7a0b1",
            "sg-06a33af50d909a0f2",
            "sg-0fbd03f5ffbb7f0eb"
          ],
          Status: "in-use",
          OwnerID: "",
          AttachTime: "2022-07-11T06:13:36Z",
          MacAddress: "06:17:48:3a:2f:e8",
          Description: "aws-K8S-i-05885b04545c37f14",
          DeviceIndex: 2,
          AttachmentID: "eni-attach-061305440d97d8d10",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDNSName: "ip-10-0-4-51.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIPAddress: "10.0.4.51",
          NetworkInterfaceID: "eni-00943945f4b864317",
          PrivateIPAddresses: [
            "10.0.4.51",
            "10.0.4.98",
            "10.0.4.131",
            "10.0.4.230",
            "10.0.4.6",
            "10.0.4.200",
            "10.0.4.72",
            "10.0.4.233",
            "10.0.4.107",
            "10.0.4.236",
            "10.0.4.15",
            "10.0.4.17",
            "10.0.4.154",
            "10.0.4.27",
            "10.0.4.94"
          ],
          DeleteOnTermination: true
        }
      ],
      private_ip_address: "10.0.4.100",
      virtualization_type: "hvm",
      iam_instance_profile:
        "arn:aws:iam::745897381572:instance-profile/eksctl-flanksource-canary-cluster-nodegroup-ng2-NodeInstanceProfile-PSCO6KEEE0F6",
      block_device_mappings: [
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-0bf4c70108986fd54",
            AttachTime: "2022-07-10T17:49:28Z",
            DeleteOnTermination: true
          },
          DeviceName: "/dev/xvda"
        }
      ],
      usage_operation_update_time: "2022-07-10T17:49:28Z"
    },
    created_at: "0001-01-01T00:00:00",
    updated_at: "2022-07-26T13:16:25.995233",
    source: "",
    tags: {
      Name: "flanksource-canary-cluster-ng2-Node",
      "aws:ec2launchtemplate:id": "lt-0482435569f922b0b",
      "aws:autoscaling:groupName":
        "eksctl-flanksource-canary-cluster-nodegroup-ng2-NodeGroup-DI24EJRMUAC5",
      "aws:cloudformation:stack-id":
        "arn:aws:cloudformation:eu-west-2:745897381572:stack/eksctl-flanksource-canary-cluster-nodegroup-ng2/a5704a70-0848-11ec-9abc-0664644b2bde",
      "alpha.eksctl.io/cluster-name": "flanksource-canary-cluster",
      "aws:cloudformation:logical-id": "NodeGroup",
      "aws:cloudformation:stack-name":
        "eksctl-flanksource-canary-cluster-nodegroup-ng2",
      "aws:ec2launchtemplate:version": "1",
      "alpha.eksctl.io/eksctl-version": "0.63.0",
      "alpha.eksctl.io/nodegroup-name": "ng2",
      "alpha.eksctl.io/nodegroup-type": "unmanaged",
      "eksctl.io/v1alpha2/nodegroup-name": "ng2",
      "eksctl.cluster.k8s.io/v1alpha1/cluster-name":
        "flanksource-canary-cluster",
      "kubernetes.io/cluster/flanksource-canary-cluster": "owned"
    }
  },
  {
    id: "0181ebeb-b9f5-d672-7279-58c24fc1e216",
    scraper_id: null,
    config_type: "EC2Instance",
    external_id: "i-08b0205c8f05f0afd",
    name: "ip-10-0-5-82.eu-west-2.compute.internal",
    namespace: null,
    description: null,
    account: "745897381572",
    region: "eu-west-2",
    zone: "eu-west-2b",
    network: "vpc-0a95bd9951b08bf6a",
    subnet: "subnet-00938f91ab87c9906",
    config: {
      tags: {
        "aws:ec2:fleet-id": "fleet-cf7d401a-41bf-db5f-041a-ab00b87a76c1",
        "eks:cluster-name": "flanksource-canary-cluster",
        "eks:nodegroup-name": "NodeGroup",
        "aws:ec2launchtemplate:id": "lt-04ba3e4998b91b4d2",
        "aws:autoscaling:groupName": "eks-e0bef09d-3f01-af8a-765f-b0cdee811a77",
        "aws:ec2launchtemplate:version": "1",
        "k8s.io/cluster-autoscaler/enabled": "true",
        "kubernetes.io/cluster/flanksource-canary-cluster": "owned",
        "k8s.io/cluster-autoscaler/flanksource-canary-cluster": "owned"
      },
      state: "running",
      vpc_id: "vpc-0a95bd9951b08bf6a",
      image_id: "ami-04e51ead8aae0ca0d",
      Inventory: {
        AgentType: "amazon-ssm-agent",
        IpAddress: "10.0.5.82",
        InstanceId: "i-08b0205c8f05f0afd",
        CaptureTime: "2022-07-22T11:10:56Z",
        AgentVersion: "3.0.1124.0",
        ComputerName: "ip-10-0-5-82.eu-west-2.compute.internal",
        PlatformName: "Amazon Linux",
        PlatformType: "Linux",
        ResourceType: "EC2Instance",
        InstanceStatus: "Active",
        PlatformVersion: "2"
      },
      subnet_id: "subnet-00938f91ab87c9906",
      Compliance: [
        {
          ID: "ec2-instance-no-public-ip",
          Annotation: "This Amazon EC2 Instance uses a public IP.",
          ComplianceType: "NON_COMPLIANT",
          ResultRecordedTime: "2022-07-24T10:36:35.093Z",
          ConfigRuleInvokedTime: "2022-07-24T10:36:34.807Z"
        }
      ],
      hypervisor: "xen",
      ena_support: true,
      instance_id: "i-08b0205c8f05f0afd",
      launch_time: "2021-12-22T08:21:41Z",
      architecture: "x86_64",
      ebs_optimized: false,
      instance_type: "t3.xlarge",
      public_dns_name: "ec2-35-176-66-232.eu-west-2.compute.amazonaws.com",
      security_groups: {
        "sg-005fd60c72b5c5042":
          "eks-cluster-sg-flanksource-canary-cluster-2035173727"
      },
      usage_operation: "RunInstances",
      ami_launch_index: 0,
      platform_details: "Linux/UNIX",
      private_dns_name: "ip-10-0-5-82.eu-west-2.compute.internal",
      root_device_name: "/dev/xvda",
      root_device_type: "ebs",
      public_ip_address: "35.176.66.232",
      source_dest_check: true,
      network_interfaces: [
        {
          Groups: ["sg-005fd60c72b5c5042"],
          Status: "in-use",
          OwnerID: "",
          AttachTime: "2021-12-22T08:21:41Z",
          MacAddress: "0a:10:7e:4c:c0:3e",
          Description: "",
          DeviceIndex: 0,
          AttachmentID: "eni-attach-0bfe0f14bc994c87b",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDNSName: "ip-10-0-5-82.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIPAddress: "10.0.5.82",
          NetworkInterfaceID: "eni-0c5dfae52aa3d8380",
          PrivateIPAddresses: [
            "10.0.5.82",
            "10.0.5.64",
            "10.0.5.97",
            "10.0.5.67",
            "10.0.5.6",
            "10.0.5.103",
            "10.0.5.41",
            "10.0.5.43",
            "10.0.5.206",
            "10.0.5.78",
            "10.0.5.207",
            "10.0.5.249",
            "10.0.5.218",
            "10.0.5.29",
            "10.0.5.157"
          ],
          DeleteOnTermination: true
        },
        {
          Groups: ["sg-005fd60c72b5c5042"],
          Status: "in-use",
          OwnerID: "",
          AttachTime: "2021-12-22T08:22:52Z",
          MacAddress: "0a:fe:84:04:5f:4e",
          Description: "aws-K8S-i-08b0205c8f05f0afd",
          DeviceIndex: 1,
          AttachmentID: "eni-attach-0937a29328a54e569",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDNSName: "ip-10-0-5-175.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIPAddress: "10.0.5.175",
          NetworkInterfaceID: "eni-0b512fe203a428e32",
          PrivateIPAddresses: [
            "10.0.5.175",
            "10.0.5.4",
            "10.0.5.70",
            "10.0.5.167",
            "10.0.5.74",
            "10.0.5.75",
            "10.0.5.139",
            "10.0.5.45",
            "10.0.5.144",
            "10.0.5.17",
            "10.0.5.117",
            "10.0.5.119",
            "10.0.5.247",
            "10.0.5.62",
            "10.0.5.126"
          ],
          DeleteOnTermination: true
        },
        {
          Groups: ["sg-005fd60c72b5c5042"],
          Status: "in-use",
          OwnerID: "",
          AttachTime: "2021-12-22T08:35:47Z",
          MacAddress: "0a:7d:f4:63:4a:6e",
          Description: "aws-K8S-i-08b0205c8f05f0afd",
          DeviceIndex: 2,
          AttachmentID: "eni-attach-011cd219f39488456",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDNSName: "ip-10-0-5-219.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIPAddress: "10.0.5.219",
          NetworkInterfaceID: "eni-050f89f4904128979",
          PrivateIPAddresses: [
            "10.0.5.219",
            "10.0.5.226",
            "10.0.5.100",
            "10.0.5.197",
            "10.0.5.14",
            "10.0.5.15",
            "10.0.5.19",
            "10.0.5.20",
            "10.0.5.152",
            "10.0.5.216",
            "10.0.5.25",
            "10.0.5.123",
            "10.0.5.124",
            "10.0.5.95",
            "10.0.5.127"
          ],
          DeleteOnTermination: true
        },
        {
          Groups: ["sg-005fd60c72b5c5042"],
          Status: "in-use",
          OwnerID: "",
          AttachTime: "2021-12-22T17:43:11Z",
          MacAddress: "0a:04:aa:15:3e:f4",
          Description: "aws-K8S-i-08b0205c8f05f0afd",
          DeviceIndex: 3,
          AttachmentID: "eni-attach-00f5897aef1147a64",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDNSName: "ip-10-0-5-153.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIPAddress: "10.0.5.153",
          NetworkInterfaceID: "eni-0d3290b13b6b5ee2b",
          PrivateIPAddresses: [
            "10.0.5.153",
            "10.0.5.198",
            "10.0.5.231",
            "10.0.5.201",
            "10.0.5.106",
            "10.0.5.235",
            "10.0.5.204",
            "10.0.5.13",
            "10.0.5.47",
            "10.0.5.80",
            "10.0.5.146",
            "10.0.5.245",
            "10.0.5.150",
            "10.0.5.252",
            "10.0.5.191"
          ],
          DeleteOnTermination: true
        }
      ],
      private_ip_address: "10.0.5.82",
      virtualization_type: "hvm",
      iam_instance_profile:
        "arn:aws:iam::745897381572:instance-profile/eks-e0bef09d-3f01-af8a-765f-b0cdee811a77",
      block_device_mappings: [
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-076faf4ad267b0fd0",
            AttachTime: "2021-12-22T08:21:42Z",
            DeleteOnTermination: true
          },
          DeviceName: "/dev/xvda"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-09c83ed495dc81474",
            AttachTime: "2021-12-22T08:35:47Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdbb"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-05a9f6d01cb710839",
            AttachTime: "2021-12-23T06:02:15Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdbu"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-062457ef697a8d28f",
            AttachTime: "2021-12-23T06:03:27Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdcd"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-07ecda90c0cae36df",
            AttachTime: "2021-12-23T07:59:27Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdcb"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-0a12b520c14b98dfa",
            AttachTime: "2022-07-11T06:13:47Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdcu"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-0e51ef0d59d92f82c",
            AttachTime: "2022-07-11T06:13:49Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdbw"
        }
      ],
      usage_operation_update_time: "2021-12-22T08:21:41Z"
    },
    created_at: "0001-01-01T00:00:00",
    updated_at: "2022-07-26T13:16:26.002084",
    source: "",
    tags: {
      "aws:ec2:fleet-id": "fleet-cf7d401a-41bf-db5f-041a-ab00b87a76c1",
      "eks:cluster-name": "flanksource-canary-cluster",
      "eks:nodegroup-name": "NodeGroup",
      "aws:ec2launchtemplate:id": "lt-04ba3e4998b91b4d2",
      "aws:autoscaling:groupName": "eks-e0bef09d-3f01-af8a-765f-b0cdee811a77",
      "aws:ec2launchtemplate:version": "1",
      "k8s.io/cluster-autoscaler/enabled": "true",
      "kubernetes.io/cluster/flanksource-canary-cluster": "owned",
      "k8s.io/cluster-autoscaler/flanksource-canary-cluster": "owned"
    }
  },
  {
    id: "0181ebeb-b9e4-8a77-3804-9b98795ca9ce",
    scraper_id: null,
    config_type: "Subnet",
    external_id: "subnet-00938f91ab87c9906",
    name: "",
    namespace: null,
    description: null,
    account: "745897381572",
    region: "eu-west-2",
    zone: "eu-west-2b",
    network: "vpc-0a95bd9951b08bf6a",
    subnet: "subnet-00938f91ab87c9906",
    config: {
      Tags: [
        { Key: "kubernetes.io/role/elb", Value: "1" },
        {
          Key: "kubernetes.io/cluster/flanksource-canary-cluster",
          Value: "shared"
        },
        { Key: "Name", Value: "flanksource-canary-cluster-public-eu-west-2b" }
      ],
      State: "available",
      VpcId: "vpc-0a95bd9951b08bf6a",
      OwnerId: "745897381572",
      SubnetId: "subnet-00938f91ab87c9906",
      CidrBlock: "10.0.5.0/24",
      SubnetArn:
        "arn:aws:ec2:eu-west-2:745897381572:subnet/subnet-00938f91ab87c9906",
      Ipv6Native: false,
      OutpostArn: null,
      EnableDns64: false,
      DefaultForAz: false,
      AvailabilityZone: "eu-west-2b",
      AvailabilityZoneId: "euw2-az3",
      MapPublicIpOnLaunch: true,
      CustomerOwnedIpv4Pool: null,
      EnableLniAtDeviceIndex: null,
      AvailableIpAddressCount: 190,
      MapCustomerOwnedIpOnLaunch: false,
      AssignIpv6AddressOnCreation: false,
      Ipv6CidrBlockAssociationSet: [],
      PrivateDnsNameOptionsOnLaunch: {
        HostnameType: "ip-name",
        EnableResourceNameDnsARecord: false,
        EnableResourceNameDnsAAAARecord: false
      }
    },
    created_at: "0001-01-01T00:00:00",
    updated_at: "2022-07-26T13:16:25.918259",
    source: "",
    tags: {
      Name: "flanksource-canary-cluster-public-eu-west-2b",
      "kubernetes.io/role/elb": "1",
      "kubernetes.io/cluster/flanksource-canary-cluster": "shared"
    }
  },
  {
    id: "0181ebeb-b9ed-766c-a98a-8c3b2ea0b14d",
    scraper_id: null,
    config_type: "Subnet",
    external_id: "subnet-00023ad659ae1e065",
    name: "",
    namespace: null,
    description: null,
    account: "745897381572",
    region: "eu-west-2",
    zone: "eu-west-2c",
    network: "vpc-0a95bd9951b08bf6a",
    subnet: "subnet-00023ad659ae1e065",
    config: {
      Tags: [
        { Key: "Name", Value: "flanksource-canary-cluster-private-eu-west-2c" },
        { Key: "kubernetes.io/role/internal-elb", Value: "1" },
        {
          Key: "kubernetes.io/cluster/flanksource-canary-cluster",
          Value: "shared"
        }
      ],
      State: "available",
      VpcId: "vpc-0a95bd9951b08bf6a",
      OwnerId: "745897381572",
      SubnetId: "subnet-00023ad659ae1e065",
      CidrBlock: "10.0.3.0/24",
      SubnetArn:
        "arn:aws:ec2:eu-west-2:745897381572:subnet/subnet-00023ad659ae1e065",
      Ipv6Native: false,
      OutpostArn: null,
      EnableDns64: false,
      DefaultForAz: false,
      AvailabilityZone: "eu-west-2c",
      AvailabilityZoneId: "euw2-az1",
      MapPublicIpOnLaunch: false,
      CustomerOwnedIpv4Pool: null,
      EnableLniAtDeviceIndex: null,
      AvailableIpAddressCount: 191,
      MapCustomerOwnedIpOnLaunch: false,
      AssignIpv6AddressOnCreation: false,
      Ipv6CidrBlockAssociationSet: [],
      PrivateDnsNameOptionsOnLaunch: {
        HostnameType: "ip-name",
        EnableResourceNameDnsARecord: false,
        EnableResourceNameDnsAAAARecord: false
      }
    },
    created_at: "0001-01-01T00:00:00",
    updated_at: "2022-07-26T13:16:25.95013",
    source: "",
    tags: {
      Name: "flanksource-canary-cluster-private-eu-west-2c",
      "kubernetes.io/role/internal-elb": "1",
      "kubernetes.io/cluster/flanksource-canary-cluster": "shared"
    }
  },
  {
    id: "0181ebeb-b9f8-06f6-5a14-d8da96a0ead4",
    scraper_id: null,
    config_type: "EC2Instance",
    external_id: "i-08e9870380cb997fd",
    name: "ip-10-0-3-135.eu-west-2.compute.internal",
    namespace: null,
    description: null,
    account: "745897381572",
    region: "eu-west-2",
    zone: "eu-west-2c",
    network: "vpc-0a95bd9951b08bf6a",
    subnet: "subnet-00023ad659ae1e065",
    config: {
      tags: {
        "aws:ec2:fleet-id": "fleet-c5ff6090-63bf-fb5d-0638-29880aabeafe",
        "eks:cluster-name": "flanksource-canary-cluster",
        "eks:nodegroup-name": "NodeGroup",
        "aws:ec2launchtemplate:id": "lt-04ba3e4998b91b4d2",
        "aws:autoscaling:groupName": "eks-e0bef09d-3f01-af8a-765f-b0cdee811a77",
        "aws:ec2launchtemplate:version": "1",
        "k8s.io/cluster-autoscaler/enabled": "true",
        "kubernetes.io/cluster/flanksource-canary-cluster": "owned",
        "k8s.io/cluster-autoscaler/flanksource-canary-cluster": "owned"
      },
      state: "running",
      vpc_id: "vpc-0a95bd9951b08bf6a",
      image_id: "ami-04e51ead8aae0ca0d",
      Inventory: {
        AgentType: "amazon-ssm-agent",
        IpAddress: "10.0.3.135",
        InstanceId: "i-08e9870380cb997fd",
        CaptureTime: "2022-07-22T10:01:41Z",
        AgentVersion: "3.0.1124.0",
        ComputerName: "ip-10-0-3-135.eu-west-2.compute.internal",
        PlatformName: "Amazon Linux",
        PlatformType: "Linux",
        ResourceType: "EC2Instance",
        InstanceStatus: "Active",
        PlatformVersion: "2"
      },
      subnet_id: "subnet-00023ad659ae1e065",
      Compliance: [
        {
          ID: "ec2-instance-no-public-ip",
          Annotation: "",
          ComplianceType: "COMPLIANT",
          ResultRecordedTime: "2022-07-24T10:36:31.419Z",
          ConfigRuleInvokedTime: "2022-07-24T10:36:31.188Z"
        }
      ],
      hypervisor: "xen",
      ena_support: true,
      instance_id: "i-08e9870380cb997fd",
      launch_time: "2021-12-22T08:21:42Z",
      architecture: "x86_64",
      ebs_optimized: false,
      instance_type: "t3.xlarge",
      security_groups: {
        "sg-005fd60c72b5c5042":
          "eks-cluster-sg-flanksource-canary-cluster-2035173727"
      },
      usage_operation: "RunInstances",
      ami_launch_index: 0,
      platform_details: "Linux/UNIX",
      private_dns_name: "ip-10-0-3-135.eu-west-2.compute.internal",
      root_device_name: "/dev/xvda",
      root_device_type: "ebs",
      source_dest_check: true,
      network_interfaces: [
        {
          Groups: ["sg-005fd60c72b5c5042"],
          Status: "in-use",
          OwnerID: "",
          AttachTime: "2021-12-22T08:21:42Z",
          MacAddress: "02:71:04:56:4c:80",
          Description: "",
          DeviceIndex: 0,
          AttachmentID: "eni-attach-00321c6c878b51e60",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDNSName: "ip-10-0-3-135.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIPAddress: "10.0.3.135",
          NetworkInterfaceID: "eni-00e9ef450c303b0f7",
          PrivateIPAddresses: [
            "10.0.3.135",
            "10.0.3.224",
            "10.0.3.162",
            "10.0.3.98",
            "10.0.3.132",
            "10.0.3.197",
            "10.0.3.134",
            "10.0.3.136",
            "10.0.3.232",
            "10.0.3.9",
            "10.0.3.73",
            "10.0.3.241",
            "10.0.3.49",
            "10.0.3.146",
            "10.0.3.123"
          ],
          DeleteOnTermination: true
        },
        {
          Groups: ["sg-005fd60c72b5c5042"],
          Status: "in-use",
          OwnerID: "",
          AttachTime: "2021-12-22T08:22:53Z",
          MacAddress: "02:81:a3:48:88:8a",
          Description: "aws-K8S-i-08e9870380cb997fd",
          DeviceIndex: 1,
          AttachmentID: "eni-attach-018b2323fbaf79f07",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDNSName: "ip-10-0-3-54.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIPAddress: "10.0.3.54",
          NetworkInterfaceID: "eni-0bd98b3d6ab61db72",
          PrivateIPAddresses: [
            "10.0.3.54",
            "10.0.3.68",
            "10.0.3.133",
            "10.0.3.70",
            "10.0.3.166",
            "10.0.3.235",
            "10.0.3.141",
            "10.0.3.144",
            "10.0.3.52",
            "10.0.3.53",
            "10.0.3.245",
            "10.0.3.87",
            "10.0.3.183",
            "10.0.3.23",
            "10.0.3.119"
          ],
          DeleteOnTermination: true
        },
        {
          Groups: ["sg-005fd60c72b5c5042"],
          Status: "in-use",
          OwnerID: "",
          AttachTime: "2021-12-22T08:35:47Z",
          MacAddress: "02:40:9f:37:25:74",
          Description: "aws-K8S-i-08e9870380cb997fd",
          DeviceIndex: 2,
          AttachmentID: "eni-attach-00e58f8009ee3ddca",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDNSName: "ip-10-0-3-251.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIPAddress: "10.0.3.251",
          NetworkInterfaceID: "eni-03b1848c6ca53edd1",
          PrivateIPAddresses: [
            "10.0.3.251",
            "10.0.3.34",
            "10.0.3.99",
            "10.0.3.164",
            "10.0.3.233",
            "10.0.3.74",
            "10.0.3.11",
            "10.0.3.172",
            "10.0.3.176",
            "10.0.3.117",
            "10.0.3.215",
            "10.0.3.152",
            "10.0.3.57",
            "10.0.3.92",
            "10.0.3.61"
          ],
          DeleteOnTermination: true
        },
        {
          Groups: ["sg-005fd60c72b5c5042"],
          Status: "in-use",
          OwnerID: "",
          AttachTime: "2021-12-22T10:57:20Z",
          MacAddress: "02:0d:d0:2e:8c:30",
          Description: "aws-K8S-i-08e9870380cb997fd",
          DeviceIndex: 3,
          AttachmentID: "eni-attach-05b838d3300e73b64",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDNSName: "ip-10-0-3-198.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIPAddress: "10.0.3.198",
          NetworkInterfaceID: "eni-04522547d004301b5",
          PrivateIPAddresses: [
            "10.0.3.198",
            "10.0.3.128",
            "10.0.3.66",
            "10.0.3.228",
            "10.0.3.5",
            "10.0.3.103",
            "10.0.3.43",
            "10.0.3.174",
            "10.0.3.83",
            "10.0.3.147",
            "10.0.3.179",
            "10.0.3.244",
            "10.0.3.21",
            "10.0.3.118",
            "10.0.3.184"
          ],
          DeleteOnTermination: true
        }
      ],
      private_ip_address: "10.0.3.135",
      virtualization_type: "hvm",
      iam_instance_profile:
        "arn:aws:iam::745897381572:instance-profile/eks-e0bef09d-3f01-af8a-765f-b0cdee811a77",
      block_device_mappings: [
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-0d71dabd239a07b66",
            AttachTime: "2021-12-22T08:21:42Z",
            DeleteOnTermination: true
          },
          DeviceName: "/dev/xvda"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-0bdb62a256bf2ca77",
            AttachTime: "2021-12-23T07:57:37Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdbv"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-0f58cb689fa07ed07",
            AttachTime: "2021-12-23T07:57:37Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdct"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-05c1482f969e390fd",
            AttachTime: "2021-12-27T04:21:18Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdby"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-03bd51369c3013c99",
            AttachTime: "2022-05-04T08:32:18Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdbc"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-0557a4eeba7185371",
            AttachTime: "2022-05-04T08:32:21Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdbm"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-04afdcd22c80e0b96",
            AttachTime: "2022-07-11T06:13:46Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdcp"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-0477d9779feffd5c0",
            AttachTime: "2022-07-11T06:13:46Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdcf"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-05f71da83fd10468e",
            AttachTime: "2022-07-11T06:13:56Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdbn"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-0d07c22777f77f415",
            AttachTime: "2022-07-11T06:14:01Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdbh"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-043f114c05ca4fedb",
            AttachTime: "2022-07-11T06:14:24Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdci"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-0b11005e77c38af87",
            AttachTime: "2022-07-11T06:14:26Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdbi"
        }
      ],
      usage_operation_update_time: "2021-12-22T08:21:42Z"
    },
    created_at: "0001-01-01T00:00:00",
    updated_at: "2022-07-26T13:16:25.98786",
    source: "",
    tags: {
      "aws:ec2:fleet-id": "fleet-c5ff6090-63bf-fb5d-0638-29880aabeafe",
      "eks:cluster-name": "flanksource-canary-cluster",
      "eks:nodegroup-name": "NodeGroup",
      "aws:ec2launchtemplate:id": "lt-04ba3e4998b91b4d2",
      "aws:autoscaling:groupName": "eks-e0bef09d-3f01-af8a-765f-b0cdee811a77",
      "aws:ec2launchtemplate:version": "1",
      "k8s.io/cluster-autoscaler/enabled": "true",
      "kubernetes.io/cluster/flanksource-canary-cluster": "owned",
      "k8s.io/cluster-autoscaler/flanksource-canary-cluster": "owned"
    }
  },
  {
    id: "0181ebeb-b9eb-070d-813e-4ede9fda2f4f",
    scraper_id: null,
    config_type: "Subnet",
    external_id: "subnet-41d8b70c",
    name: "",
    namespace: null,
    description: null,
    account: "745897381572",
    region: "eu-west-2",
    zone: "eu-west-2b",
    network: "vpc-f3c6e49a",
    subnet: "subnet-41d8b70c",
    config: {
      Tags: null,
      State: "available",
      VpcId: "vpc-f3c6e49a",
      OwnerId: "745897381572",
      SubnetId: "subnet-41d8b70c",
      CidrBlock: "172.31.16.0/20",
      SubnetArn: "arn:aws:ec2:eu-west-2:745897381572:subnet/subnet-41d8b70c",
      Ipv6Native: false,
      OutpostArn: null,
      EnableDns64: false,
      DefaultForAz: true,
      AvailabilityZone: "eu-west-2b",
      AvailabilityZoneId: "euw2-az3",
      MapPublicIpOnLaunch: true,
      CustomerOwnedIpv4Pool: null,
      EnableLniAtDeviceIndex: null,
      AvailableIpAddressCount: 4091,
      MapCustomerOwnedIpOnLaunch: false,
      AssignIpv6AddressOnCreation: false,
      Ipv6CidrBlockAssociationSet: [],
      PrivateDnsNameOptionsOnLaunch: {
        HostnameType: "ip-name",
        EnableResourceNameDnsARecord: false,
        EnableResourceNameDnsAAAARecord: false
      }
    },
    created_at: "0001-01-01T00:00:00",
    updated_at: "2022-07-26T13:16:25.943848",
    source: "",
    tags: {}
  },
  {
    id: "0181ebeb-b9f0-d17d-dd5d-edb9ef828233",
    scraper_id: null,
    config_type: "Subnet",
    external_id: "subnet-01811d23bca434bd3",
    name: "",
    namespace: null,
    description: null,
    account: "745897381572",
    region: "eu-west-2",
    zone: "eu-west-2c",
    network: "vpc-0a95bd9951b08bf6a",
    subnet: "subnet-01811d23bca434bd3",
    config: {
      Tags: [
        { Key: "Name", Value: "flanksource-canary-cluster-public-eu-west-2c" },
        {
          Key: "kubernetes.io/cluster/flanksource-canary-cluster",
          Value: "shared"
        },
        { Key: "kubernetes.io/role/elb", Value: "1" }
      ],
      State: "available",
      VpcId: "vpc-0a95bd9951b08bf6a",
      OwnerId: "745897381572",
      SubnetId: "subnet-01811d23bca434bd3",
      CidrBlock: "10.0.6.0/24",
      SubnetArn:
        "arn:aws:ec2:eu-west-2:745897381572:subnet/subnet-01811d23bca434bd3",
      Ipv6Native: false,
      OutpostArn: null,
      EnableDns64: false,
      DefaultForAz: false,
      AvailabilityZone: "eu-west-2c",
      AvailabilityZoneId: "euw2-az1",
      MapPublicIpOnLaunch: true,
      CustomerOwnedIpv4Pool: null,
      EnableLniAtDeviceIndex: null,
      AvailableIpAddressCount: 250,
      MapCustomerOwnedIpOnLaunch: false,
      AssignIpv6AddressOnCreation: false,
      Ipv6CidrBlockAssociationSet: [],
      PrivateDnsNameOptionsOnLaunch: {
        HostnameType: "ip-name",
        EnableResourceNameDnsARecord: false,
        EnableResourceNameDnsAAAARecord: false
      }
    },
    created_at: "0001-01-01T00:00:00",
    updated_at: "2022-07-26T13:16:25.962949",
    source: "",
    tags: {
      Name: "flanksource-canary-cluster-public-eu-west-2c",
      "kubernetes.io/role/elb": "1",
      "kubernetes.io/cluster/flanksource-canary-cluster": "shared"
    }
  },
  {
    id: "0181ebeb-b9e9-3b2e-1f8d-60d65f765aa6",
    scraper_id: null,
    config_type: "Subnet",
    external_id: "subnet-0bcbcb35662a9a793",
    name: "",
    namespace: null,
    description: null,
    account: "745897381572",
    region: "eu-west-2",
    zone: "eu-west-2a",
    network: "vpc-0a95bd9951b08bf6a",
    subnet: "subnet-0bcbcb35662a9a793",
    config: {
      Tags: [
        {
          Key: "kubernetes.io/cluster/flanksource-canary-cluster",
          Value: "shared"
        },
        { Key: "kubernetes.io/role/internal-elb", Value: "1" },
        { Key: "Name", Value: "flanksource-canary-cluster-private-eu-west-2a" }
      ],
      State: "available",
      VpcId: "vpc-0a95bd9951b08bf6a",
      OwnerId: "745897381572",
      SubnetId: "subnet-0bcbcb35662a9a793",
      CidrBlock: "10.0.1.0/24",
      SubnetArn:
        "arn:aws:ec2:eu-west-2:745897381572:subnet/subnet-0bcbcb35662a9a793",
      Ipv6Native: false,
      OutpostArn: null,
      EnableDns64: false,
      DefaultForAz: false,
      AvailabilityZone: "eu-west-2a",
      AvailabilityZoneId: "euw2-az2",
      MapPublicIpOnLaunch: false,
      CustomerOwnedIpv4Pool: null,
      EnableLniAtDeviceIndex: null,
      AvailableIpAddressCount: 250,
      MapCustomerOwnedIpOnLaunch: false,
      AssignIpv6AddressOnCreation: false,
      Ipv6CidrBlockAssociationSet: [],
      PrivateDnsNameOptionsOnLaunch: {
        HostnameType: "ip-name",
        EnableResourceNameDnsARecord: false,
        EnableResourceNameDnsAAAARecord: false
      }
    },
    created_at: "0001-01-01T00:00:00",
    updated_at: "2022-07-26T13:16:25.937596",
    source: "",
    tags: {
      Name: "flanksource-canary-cluster-private-eu-west-2a",
      "kubernetes.io/role/internal-elb": "1",
      "kubernetes.io/cluster/flanksource-canary-cluster": "shared"
    }
  },
  {
    id: "0181ebeb-b9f2-ebda-3f15-501c051986d0",
    scraper_id: null,
    config_type: "Subnet",
    external_id: "subnet-03ee8e39821abdf76",
    name: "",
    namespace: null,
    description: null,
    account: "745897381572",
    region: "eu-west-2",
    zone: "eu-west-2b",
    network: "vpc-0a95bd9951b08bf6a",
    subnet: "subnet-03ee8e39821abdf76",
    config: {
      Tags: [
        { Key: "Name", Value: "flanksource-canary-cluster-private-eu-west-2b" },
        { Key: "kubernetes.io/role/internal-elb", Value: "1" },
        {
          Key: "kubernetes.io/cluster/flanksource-canary-cluster",
          Value: "shared"
        }
      ],
      State: "available",
      VpcId: "vpc-0a95bd9951b08bf6a",
      OwnerId: "745897381572",
      SubnetId: "subnet-03ee8e39821abdf76",
      CidrBlock: "10.0.2.0/24",
      SubnetArn:
        "arn:aws:ec2:eu-west-2:745897381572:subnet/subnet-03ee8e39821abdf76",
      Ipv6Native: false,
      OutpostArn: null,
      EnableDns64: false,
      DefaultForAz: false,
      AvailabilityZone: "eu-west-2b",
      AvailabilityZoneId: "euw2-az3",
      MapPublicIpOnLaunch: false,
      CustomerOwnedIpv4Pool: null,
      EnableLniAtDeviceIndex: null,
      AvailableIpAddressCount: 250,
      MapCustomerOwnedIpOnLaunch: false,
      AssignIpv6AddressOnCreation: false,
      Ipv6CidrBlockAssociationSet: [],
      PrivateDnsNameOptionsOnLaunch: {
        HostnameType: "ip-name",
        EnableResourceNameDnsARecord: false,
        EnableResourceNameDnsAAAARecord: false
      }
    },
    created_at: "0001-01-01T00:00:00",
    updated_at: "2022-07-26T13:16:25.974721",
    source: "",
    tags: {
      Name: "flanksource-canary-cluster-private-eu-west-2b",
      "kubernetes.io/role/internal-elb": "1",
      "kubernetes.io/cluster/flanksource-canary-cluster": "shared"
    }
  },
  {
    id: "0181ebeb-b9ef-23ec-f003-29e17c59300b",
    scraper_id: null,
    config_type: "Subnet",
    external_id: "subnet-efd61086",
    name: "",
    namespace: null,
    description: null,
    account: "745897381572",
    region: "eu-west-2",
    zone: "eu-west-2c",
    network: "vpc-f3c6e49a",
    subnet: "subnet-efd61086",
    config: {
      Tags: null,
      State: "available",
      VpcId: "vpc-f3c6e49a",
      OwnerId: "745897381572",
      SubnetId: "subnet-efd61086",
      CidrBlock: "172.31.32.0/20",
      SubnetArn: "arn:aws:ec2:eu-west-2:745897381572:subnet/subnet-efd61086",
      Ipv6Native: false,
      OutpostArn: null,
      EnableDns64: false,
      DefaultForAz: true,
      AvailabilityZone: "eu-west-2c",
      AvailabilityZoneId: "euw2-az1",
      MapPublicIpOnLaunch: true,
      CustomerOwnedIpv4Pool: null,
      EnableLniAtDeviceIndex: null,
      AvailableIpAddressCount: 4091,
      MapCustomerOwnedIpOnLaunch: false,
      AssignIpv6AddressOnCreation: false,
      Ipv6CidrBlockAssociationSet: [],
      PrivateDnsNameOptionsOnLaunch: {
        HostnameType: "ip-name",
        EnableResourceNameDnsARecord: false,
        EnableResourceNameDnsAAAARecord: false
      }
    },
    created_at: "0001-01-01T00:00:00",
    updated_at: "2022-07-26T13:16:25.95636",
    source: "",
    tags: {}
  },
  {
    id: "0181ebeb-b9f3-a8f2-1c11-85d18ce59979",
    scraper_id: null,
    config_type: "Subnet",
    external_id: "subnet-03c20ec3935232b26",
    name: "",
    namespace: null,
    description: null,
    account: "745897381572",
    region: "eu-west-2",
    zone: "eu-west-2a",
    network: "vpc-0a95bd9951b08bf6a",
    subnet: "subnet-03c20ec3935232b26",
    config: {
      Tags: [
        { Key: "kubernetes.io/role/elb", Value: "1" },
        {
          Key: "kubernetes.io/cluster/flanksource-canary-cluster",
          Value: "shared"
        },
        { Key: "Name", Value: "flanksource-canary-cluster-public-eu-west-2a" }
      ],
      State: "available",
      VpcId: "vpc-0a95bd9951b08bf6a",
      OwnerId: "745897381572",
      SubnetId: "subnet-03c20ec3935232b26",
      CidrBlock: "10.0.4.0/24",
      SubnetArn:
        "arn:aws:ec2:eu-west-2:745897381572:subnet/subnet-03c20ec3935232b26",
      Ipv6Native: false,
      OutpostArn: null,
      EnableDns64: false,
      DefaultForAz: false,
      AvailabilityZone: "eu-west-2a",
      AvailabilityZoneId: "euw2-az2",
      MapPublicIpOnLaunch: true,
      CustomerOwnedIpv4Pool: null,
      EnableLniAtDeviceIndex: null,
      AvailableIpAddressCount: 189,
      MapCustomerOwnedIpOnLaunch: false,
      AssignIpv6AddressOnCreation: false,
      Ipv6CidrBlockAssociationSet: [],
      PrivateDnsNameOptionsOnLaunch: {
        HostnameType: "ip-name",
        EnableResourceNameDnsARecord: false,
        EnableResourceNameDnsAAAARecord: false
      }
    },
    created_at: "0001-01-01T00:00:00",
    updated_at: "2022-07-26T13:16:25.981401",
    source: "",
    tags: {
      Name: "flanksource-canary-cluster-public-eu-west-2a",
      "kubernetes.io/role/elb": "1",
      "kubernetes.io/cluster/flanksource-canary-cluster": "shared"
    }
  }
];
