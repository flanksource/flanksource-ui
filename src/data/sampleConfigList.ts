import { ConfigItem } from "../api/types/configs";

function canonTags(
  tags: undefined | { Key: string; Value: string }[] | { [index: string]: any }
) {
  if (!tags) return {};

  if (!Array.isArray(tags)) {
    return tags;
  }

  return Object.fromEntries(tags.map((kv) => [kv["Key"], kv["Value"]]));
}

const data: Omit<ConfigItem, "summary">[] = [
  {
    id: "018099cf-530e-5b8a-9e10-3e6bec11ab98",
    scraper_id: null,
    type: "Subnet",
    external_id: ["subnet-8ed885f5"],
    name: "",
    namespace: null,
    description: null,
    account: "745897381572",
    region: "eu-west-2",
    zone: "eu-west-2a",
    network: "vpc-f3c6e49a",
    subnet: "subnet-8ed885f5",
    config: {
      Tags: { Name: "A name", Another: "Another" },
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
    updated_at: "2022-05-13T14:39:03.154671"
  },
  {
    id: "018099cf-5312-14a7-5bc2-a38b56f49cc7",
    scraper_id: null,
    type: "Subnet",
    external_id: ["subnet-41d8b70c"],
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
    updated_at: "2022-05-13T14:39:03.157904"
  },
  {
    id: "018099cf-5313-d2e8-24a6-46f2a0700758",
    scraper_id: null,
    type: "Subnet",
    external_id: ["subnet-00023ad659ae1e065"],
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
        {
          Key: "Name",
          Value: "flanksource-canary-cluster-private-eu-west-2c"
        },
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
    updated_at: "2022-05-13T14:39:03.159318"
  },
  {
    id: "018099cf-5318-cd0d-30d9-930bfe0e2b4b",
    scraper_id: null,
    type: "Subnet",
    external_id: ["subnet-efd61086"],
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
    updated_at: "2022-05-13T14:39:03.160896"
  },
  {
    id: "018099cf-531a-fc72-cca6-ef930cadd235",
    scraper_id: null,
    type: "Subnet",
    external_id: ["subnet-01811d23bca434bd3"],
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
        {
          Key: "Name",
          Value: "flanksource-canary-cluster-public-eu-west-2c"
        },
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
    updated_at: "2022-05-13T14:39:03.162448"
  },
  {
    id: "018099cf-531b-5986-247e-11064d480d2e",
    scraper_id: null,
    type: "Subnet",
    external_id: ["subnet-03ee8e39821abdf76"],
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
        {
          Key: "Name",
          Value: "flanksource-canary-cluster-private-eu-west-2b"
        },
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
      AvailableIpAddressCount: 251,
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
    updated_at: "2022-05-13T14:39:03.163969"
  },
  {
    id: "018099cf-531d-f90b-c7a4-b5595ab8e22e",
    scraper_id: null,
    type: "Subnet",
    external_id: ["subnet-03c20ec3935232b26"],
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
    updated_at: "2022-05-13T14:39:03.165578"
  },
  {
    id: "018099cf-531f-6cda-ca8a-b0234941dad4",
    scraper_id: null,
    type: "EC2Instance",
    external_id: ["i-08b0205c8f05f0afd"],
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
        CaptureTime: "2022-05-12T18:30:51Z",
        AgentVersion: "3.0.1124.0",
        ComputerName: "ip-10-0-5-82.eu-west-2.compute.internal",
        PlatformName: "Amazon Linux",
        PlatformType: "Linux",
        ResourceType: "EC2Instance",
        InstanceStatus: "Active",
        PlatformVersion: "2"
      },
      subnet_id: "subnet-00938f91ab87c9906",
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
          OwnerId: "",
          AttachTime: "2021-12-22T08:21:41Z",
          MacAddress: "0a:10:7e:4c:c0:3e",
          Description: "",
          DeviceIndex: 0,
          AttachmentId: "eni-attach-0bfe0f14bc994c87b",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDnsName: "ip-10-0-5-82.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIpAddress: "10.0.5.82",
          NetworkInterfaceId: "eni-0c5dfae52aa3d8380",
          PrivateIpAddresses: [
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
          OwnerId: "",
          AttachTime: "2021-12-22T08:22:52Z",
          MacAddress: "0a:fe:84:04:5f:4e",
          Description: "aws-K8S-i-08b0205c8f05f0afd",
          DeviceIndex: 1,
          AttachmentId: "eni-attach-0937a29328a54e569",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDnsName: "ip-10-0-5-175.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIpAddress: "10.0.5.175",
          NetworkInterfaceId: "eni-0b512fe203a428e32",
          PrivateIpAddresses: [
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
          OwnerId: "",
          AttachTime: "2021-12-22T08:35:47Z",
          MacAddress: "0a:7d:f4:63:4a:6e",
          Description: "aws-K8S-i-08b0205c8f05f0afd",
          DeviceIndex: 2,
          AttachmentId: "eni-attach-011cd219f39488456",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDnsName: "ip-10-0-5-219.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIpAddress: "10.0.5.219",
          NetworkInterfaceId: "eni-050f89f4904128979",
          PrivateIpAddresses: [
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
          OwnerId: "",
          AttachTime: "2021-12-22T17:43:11Z",
          MacAddress: "0a:04:aa:15:3e:f4",
          Description: "aws-K8S-i-08b0205c8f05f0afd",
          DeviceIndex: 3,
          AttachmentId: "eni-attach-00f5897aef1147a64",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDnsName: "ip-10-0-5-153.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIpAddress: "10.0.5.153",
          NetworkInterfaceId: "eni-0d3290b13b6b5ee2b",
          PrivateIpAddresses: [
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
            VolumeId: "vol-0a12b520c14b98dfa",
            AttachTime: "2021-12-23T05:20:56Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdba"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-0e51ef0d59d92f82c",
            AttachTime: "2021-12-23T05:57:21Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdbs"
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
            VolumeId: "vol-00dccbed2ab6e51e5",
            AttachTime: "2021-12-23T07:34:24Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdbz"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-018185b682727c338",
            AttachTime: "2021-12-23T07:34:24Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdcn"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-0d879b598abd5ca43",
            AttachTime: "2021-12-23T07:49:28Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdbc"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-04d7700ffb4b9fc03",
            AttachTime: "2021-12-23T07:49:29Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdbx"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-0e5e776fb63ea81ae",
            AttachTime: "2021-12-23T07:49:31Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdcv"
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
            VolumeId: "vol-06b1cdf7babb9befa",
            AttachTime: "2022-05-04T07:03:28Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdcl"
        }
      ],
      usage_operation_update_time: "2021-12-22T08:21:41Z"
    },
    created_at: "0001-01-01T00:00:00",
    updated_at: "2022-05-13T14:39:03.167457"
  },
  {
    id: "018099cf-530b-255f-dde6-5ab45472bc55",
    scraper_id: null,
    type: "Subnet",
    external_id: ["subnet-00938f91ab87c9906"],
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
    updated_at: "2022-05-13T14:39:03.152783"
  },
  {
    id: "018099cf-5310-17d1-72b0-d66b2ffca241",
    scraper_id: null,
    type: "Subnet",
    external_id: ["subnet-0bcbcb35662a9a793"],
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
        {
          Key: "Name",
          Value: "flanksource-canary-cluster-private-eu-west-2a"
        }
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
    updated_at: "2022-05-13T14:39:03.156399"
  },
  {
    id: "018099cf-5322-3407-8b60-5732d41d4058",
    scraper_id: null,
    type: "EC2Instance",
    external_id: ["i-07d16293f351b1a54"],
    name: "flanksource-canary-cluster-ng2-Node",
    namespace: null,
    description: null,
    account: "745897381572",
    region: "eu-west-2",
    zone: "eu-west-2c",
    network: "vpc-0a95bd9951b08bf6a",
    subnet: "subnet-01811d23bca434bd3",
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
        IpAddress: "10.0.6.82",
        InstanceId: "i-07d16293f351b1a54",
        CaptureTime: "2022-05-09T02:29:56Z",
        AgentVersion: "3.0.1124.0",
        ComputerName: "ip-10-0-6-82.eu-west-2.compute.internal",
        PlatformName: "Amazon Linux",
        PlatformType: "Linux",
        ResourceType: "EC2Instance",
        InstanceStatus: "Active",
        PlatformVersion: "2"
      },
      subnet_id: "subnet-01811d23bca434bd3",
      hypervisor: "xen",
      ena_support: true,
      instance_id: "i-07d16293f351b1a54",
      launch_time: "2021-10-08T16:03:03Z",
      architecture: "x86_64",
      ebs_optimized: false,
      instance_type: "t3.xlarge",
      public_dns_name: "ec2-35-178-225-45.eu-west-2.compute.amazonaws.com",
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
      private_dns_name: "ip-10-0-6-82.eu-west-2.compute.internal",
      root_device_name: "/dev/xvda",
      root_device_type: "ebs",
      public_ip_address: "35.178.225.45",
      source_dest_check: true,
      network_interfaces: [
        {
          Groups: [
            "sg-06ac6be2517c7a0b1",
            "sg-06a33af50d909a0f2",
            "sg-0fbd03f5ffbb7f0eb"
          ],
          Status: "in-use",
          OwnerId: "",
          AttachTime: "2021-10-08T16:04:55Z",
          MacAddress: "02:e5:4f:77:af:f0",
          Description: "aws-K8S-i-07d16293f351b1a54",
          DeviceIndex: 1,
          AttachmentId: "eni-attach-0ab733428db3c973f",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDnsName: "ip-10-0-6-221.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIpAddress: "10.0.6.221",
          NetworkInterfaceId: "eni-03c57c38e999dc2d8",
          PrivateIpAddresses: [
            "10.0.6.221",
            "10.0.6.64",
            "10.0.6.226",
            "10.0.6.34",
            "10.0.6.137",
            "10.0.6.139",
            "10.0.6.108",
            "10.0.6.109",
            "10.0.6.177",
            "10.0.6.213",
            "10.0.6.88",
            "10.0.6.57",
            "10.0.6.25",
            "10.0.6.154",
            "10.0.6.62"
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
          OwnerId: "",
          AttachTime: "2021-10-08T16:03:03Z",
          MacAddress: "02:b8:0e:f3:c6:6c",
          Description: "",
          DeviceIndex: 0,
          AttachmentId: "eni-attach-0cee1b6455fc20fa0",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDnsName: "ip-10-0-6-82.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIpAddress: "10.0.6.82",
          NetworkInterfaceId: "eni-05e527e9476345ea5",
          PrivateIpAddresses: [
            "10.0.6.82",
            "10.0.6.101",
            "10.0.6.231",
            "10.0.6.71",
            "10.0.6.168",
            "10.0.6.72",
            "10.0.6.170",
            "10.0.6.237",
            "10.0.6.144",
            "10.0.6.49",
            "10.0.6.178",
            "10.0.6.52",
            "10.0.6.212",
            "10.0.6.61",
            "10.0.6.30"
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
          OwnerId: "",
          AttachTime: "2021-10-08T16:05:09Z",
          MacAddress: "02:35:55:f0:0f:3c",
          Description: "aws-K8S-i-07d16293f351b1a54",
          DeviceIndex: 2,
          AttachmentId: "eni-attach-00c9e850ba86bb6b5",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDnsName: "ip-10-0-6-194.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIpAddress: "10.0.6.194",
          NetworkInterfaceId: "eni-01de1cdfcca971abe",
          PrivateIpAddresses: [
            "10.0.6.194",
            "10.0.6.97",
            "10.0.6.98",
            "10.0.6.141",
            "10.0.6.18",
            "10.0.6.211",
            "10.0.6.148",
            "10.0.6.181",
            "10.0.6.247",
            "10.0.6.87",
            "10.0.6.153",
            "10.0.6.26",
            "10.0.6.125",
            "10.0.6.94",
            "10.0.6.31"
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
          OwnerId: "",
          AttachTime: "2021-10-08T16:05:29Z",
          MacAddress: "02:cf:a6:c9:f2:a6",
          Description: "aws-K8S-i-07d16293f351b1a54",
          DeviceIndex: 3,
          AttachmentId: "eni-attach-01637ec92d3dd2222",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDnsName: "ip-10-0-6-112.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIpAddress: "10.0.6.112",
          NetworkInterfaceId: "eni-01c266508c238afd5",
          PrivateIpAddresses: [
            "10.0.6.112",
            "10.0.6.100",
            "10.0.6.229",
            "10.0.6.135",
            "10.0.6.199",
            "10.0.6.73",
            "10.0.6.233",
            "10.0.6.74",
            "10.0.6.204",
            "10.0.6.140",
            "10.0.6.76",
            "10.0.6.44",
            "10.0.6.142",
            "10.0.6.54",
            "10.0.6.254"
          ],
          DeleteOnTermination: true
        }
      ],
      private_ip_address: "10.0.6.82",
      virtualization_type: "hvm",
      iam_instance_profile:
        "arn:aws:iam::745897381572:instance-profile/eksctl-flanksource-canary-cluster-nodegroup-ng2-NodeInstanceProfile-PSCO6KEEE0F6",
      block_device_mappings: [
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-0b1d0fc0812007c16",
            AttachTime: "2021-10-08T16:03:04Z",
            DeleteOnTermination: true
          },
          DeviceName: "/dev/xvda"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-043f114c05ca4fedb",
            AttachTime: "2022-05-04T08:32:12Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdbc"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-05f71da83fd10468e",
            AttachTime: "2022-05-04T08:32:24Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdbh"
        }
      ],
      usage_operation_update_time: "2021-10-08T16:03:03Z"
    },
    created_at: "0001-01-01T00:00:00",
    updated_at: "2022-05-13T14:39:03.170222"
  },
  {
    id: "018099cf-5327-9c30-86aa-fe4a96768370",
    scraper_id: null,
    type: "EC2Instance",
    external_id: ["i-08e9870380cb997fd"],
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
        CaptureTime: "2022-05-12T16:06:38Z",
        AgentVersion: "3.0.1124.0",
        ComputerName: "ip-10-0-3-135.eu-west-2.compute.internal",
        PlatformName: "Amazon Linux",
        PlatformType: "Linux",
        ResourceType: "EC2Instance",
        InstanceStatus: "Active",
        PlatformVersion: "2"
      },
      subnet_id: "subnet-00023ad659ae1e065",
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
          OwnerId: "",
          AttachTime: "2021-12-22T08:21:42Z",
          MacAddress: "02:71:04:56:4c:80",
          Description: "",
          DeviceIndex: 0,
          AttachmentId: "eni-attach-00321c6c878b51e60",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDnsName: "ip-10-0-3-135.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIpAddress: "10.0.3.135",
          NetworkInterfaceId: "eni-00e9ef450c303b0f7",
          PrivateIpAddresses: [
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
          OwnerId: "",
          AttachTime: "2021-12-22T08:22:53Z",
          MacAddress: "02:81:a3:48:88:8a",
          Description: "aws-K8S-i-08e9870380cb997fd",
          DeviceIndex: 1,
          AttachmentId: "eni-attach-018b2323fbaf79f07",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDnsName: "ip-10-0-3-54.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIpAddress: "10.0.3.54",
          NetworkInterfaceId: "eni-0bd98b3d6ab61db72",
          PrivateIpAddresses: [
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
          OwnerId: "",
          AttachTime: "2021-12-22T08:35:47Z",
          MacAddress: "02:40:9f:37:25:74",
          Description: "aws-K8S-i-08e9870380cb997fd",
          DeviceIndex: 2,
          AttachmentId: "eni-attach-00e58f8009ee3ddca",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDnsName: "ip-10-0-3-251.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIpAddress: "10.0.3.251",
          NetworkInterfaceId: "eni-03b1848c6ca53edd1",
          PrivateIpAddresses: [
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
          OwnerId: "",
          AttachTime: "2021-12-22T10:57:20Z",
          MacAddress: "02:0d:d0:2e:8c:30",
          Description: "aws-K8S-i-08e9870380cb997fd",
          DeviceIndex: 3,
          AttachmentId: "eni-attach-05b838d3300e73b64",
          Ipv4Prefixes: null,
          Ipv6Prefixes: null,
          Ipv6Addresses: null,
          PrivateDnsName: "ip-10-0-3-198.eu-west-2.compute.internal",
          SourceDestCheck: true,
          AttachmentStatus: "attached",
          NetworkCardIndex: 0,
          PrivateIpAddress: "10.0.3.198",
          NetworkInterfaceId: "eni-04522547d004301b5",
          PrivateIpAddresses: [
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
            VolumeId: "vol-0e0fd980732c04ca2",
            AttachTime: "2021-12-23T07:34:26Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdcy"
        },
        {
          Ebs: {
            Status: "attached",
            VolumeId: "vol-0d07c22777f77f415",
            AttachTime: "2021-12-23T07:56:21Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdbf"
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
            VolumeId: "vol-0b11005e77c38af87",
            AttachTime: "2021-12-23T07:59:27Z",
            DeleteOnTermination: false
          },
          DeviceName: "/dev/xvdcn"
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
        }
      ],
      usage_operation_update_time: "2021-12-22T08:21:42Z"
    },
    created_at: "0001-01-01T00:00:00",
    updated_at: "2022-05-13T14:39:03.172868"
  }
].map((r) => {
  let tags = canonTags(r.config["Tags"] || r.config.tags);
  return { ...r, tags };
});

export default data;
