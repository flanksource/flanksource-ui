import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "./Icon";

const meta: Meta<typeof Icon> = {
  component: Icon
};

export default meta;
type Story = StoryObj<typeof Icon>;

const icons = [
  "IAM::User",
  "IAM::Role",
  "ElasticLoadBalancing::LoadBalancer",
  "Kubernetes::CertificateRequest",
  "Kubernetes::Cluster",
  "EC2::Subnet",
  "EC2::SecurityGroup",
  "K8::StatefulSet",
  "K8::Deployment",
  "StatefulSet",
  "connection",
  "K8::DaemonSet",
  "K8::Cluster",
  "diff",
  "add",
  "AttachNetworkInterface",
  "Unhealthy",
  "Healthy",
  "Pod",
  "Pulling",
  "BuildFailed",
  "BuildSucceeded",
  "Build",
  "AddUserToGroup",
  "ArtifactUpToDate",
  "AttachNetworkInterface",
  "AttachRolePolicy",
  "AttachUserPolicy",
  "AttachVolume",
  "AuthorizeSecurityGroupIngress",
  "BackOff",
  "BuildFailed",
  "CertificateIssued",
  "cert-manager.io",
  "ChangeResourceRecordSets",
  "ChartPullSucceeded",
  "ConfigureHealthCheck",
  "ContainerdStart",
  "ContainerRuntimeIsDown",
  "ContainerRuntimeIsUp",
  "CREATE",
  "CreateAccessKey",
  "CreateCertificate",
  "CreateLoadBalancer",
  "CreateLoginProfile",
  "CreateNetworkInterface",
  "CreateRole",
  "CreateSecurityGroup",
  "CreateUser",
  "DetachRolePolicy",
  "DetachVolume",
  "diff",
  "Drain",
  "EnableMFADevice",
  "EnsuredLoadBalancer",
  "EnsuringLoadBalancer",
  "error",
  "Evicted",
  "EvictionThresholdMet",
  "ExternalExpanding",
  "ExternalProvisioning",
  "Failed",
  "FailedAttachVolume",
  "FailedCreatePodSandBox",
  "FailedDaemonPod",
  "FailedMount",
  "FailedScheduling",
  "FailedToUpdateEndpoint",
  "FailedToUpdateEndpointSlices",
  "FileSystemResizeRequired",
  "FileSystemResizeSuccessful",
  "FreeDiskSpaceFailed",
  "FreezeScheduled",
  "GarbageCollectionSucceeded",
  "Generated",
  "GitOperationFailed",
  "GitOperationSucceeded",
  "ImageGCFailed",
  "info",
  "Issuing",
  "KeyPairVerified",
  "Killing",
  "KubeletIsDown",
  "KubeletIsUp",
  "LeaderElection",
  "ModifyLoadBalancerAttributes",
  "NewArtifact",
  "NodeHasNoDiskPressure",
  "NodeHasSufficientMemory",
  "NodeHasSufficientPID",
  "NodeNotReady",
  "NodeNotSchedulable",
  "NodeReady",
  "NoPods",
  "NoSourceArtifact",
  "NotTriggerScaleUp",
  "NoVMEventScheduled",
  "OrderCreated",
  "OrderPending",
  "PreemptScheduled",
  "ProcessingError",
  "Progressing",
  "Provisioning",
  "ProvisioningFailed",
  "ProvisioningSucceeded",
  "PruneFailed",
  "Pulled",
  "Pulling",
  "RebootScheduled",
  "ReconciliationFailed",
  "ReconciliationSucceeded",
  "RecreatingFailedPod",
  "RedeployScheduled",
  "RegisteredNode",
  "RegisterInstancesWithLoadBalancer",
  "RELOAD",
  "Requested",
  "Resizing",
  "Reused",
  "RevokeSecurityGroupIngress",
  "ScalingReplicaSet",
  "Scheduled",
  "SourceUnavailable",
  "Started",
  "Starting",
  "Succeeded",
  "Success",
  "SuccessfulAttachVolume",
  "SuccessfulDelete",
  "Sync",
  "TagUser",
  "TaintManagerEviction",
  "UnattendedUpgradeEnabled",
  "Unhealthy",
  "UpdateAccessKey",
  "UpdateAssumeRolePolicy",
  "UpdateCertificate",
  "UpdateClusterConfig",
  "UpdatedLoadBalancer",
  "UpdateLoginProfile",
  "Upgrade",
  "VMEventScheduled",
  "VolumeResizeFailed",
  "WaitForFirstConsumer",
  "WaitingForApproval"
];
export const Primary: Story = {
  render: () => (
    <div className="flex flex-row flex-wrap">
      {icons.map((icon) => (
        <div key={icon}>
          {icon}: <Icon name={icon} /> &nbsp;
          <br />
        </div>
      ))}
    </div>
  )
};

const iconWithColors = [
  "error:red",
  "info:blue",
  "success:green",
  "error:orange",
  "shutdown:red"
];

export const IconWithColor: Story = {
  render: () => (
    <div className="flex flex-row flex-wrap">
      {iconWithColors.map((icon) => (
        <div key={icon}>
          {icon}: <Icon iconWithColor={icon} /> &nbsp;
          <br />
        </div>
      ))}
    </div>
  )
};
