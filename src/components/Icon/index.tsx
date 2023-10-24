import { isEmpty } from "lodash";
import { Icons } from "../../icons";
import React, { memo } from "react";

type IconMap = Record<string, string>;
const aliases: IconMap = {
  "aws--account": "aws",
  "aws-ec2-dhcpoptions": "settings",
  "aws-ec2-securitygroup": "firewall",
  "aws-ec2-subnet": "network",
  "aws-elasticloadbalancing-loadbalancer": "aws-elb",
  "aws-elasticloadbalancingv2-loadbalancer": "aws-alb",
  "aws-iam-user": "user",
  "aws-instance": "aws-ec2-instance",
  "aws-region": "aws",
  "aws-subnet": "network",
  "azure devops": "azure-devops",
  "azuredevops-pipelinerun": "azure-devops-pipeline",
  azuredevops: "azure-devops",
  attachnetworkinterface: "add-network-card",
  createnetworkinterface: "add-network-card",
  detachnetworkinterface: "remove-network-card",
  networkinterface: "network-card",
  "cert-manager.io": "cert-manager",
  "google chat": "google-chat",
  "google cloud": "gcp",
  keypairverified: "id-verified",
  "iam-user": "user",
  "iam-role": "shield",
  "iam-instanceprofile": "server",
  "k8s-cluster": "servers",
  "elasticloadbalancing-loadbalancer": "aws-elb",
  "ec2-subnet": "network",
  "ec2-securitygroup": "firewall",
  "mssql-database": "mssql",
  "sql server": "sqlserver",
  "zulip chat": "zulip",
  statefulset: "k8s-statefulset",
  connection: "cog",
  createrole: "add-shield",
  UpdateLoginProfile: "user",
  "k8s-certificaterequest": "certificate",
  updatecertificate: "certificate",
  updatedloadbalancer: "loadbalancer",
  attachrolepolicy: "add-shield",
  attachuserpolicy: "add-shield",
  detachuserpolicy: "remove-shield",
  detachrolepolicy: "remove-shield",
  attachvolume: "up-database",
  dettachvolume: "down-database",
  rebootscheduled: "schedule",
  // connection icons type aliases
  addmemberstogroup: "add-group",
  addorupdategroups: "add-group",
  addroletodbcluster: "k8s-role",
  addtag: "add-tag",
  addthingtothinggroup: "add-group",
  adduploadbuffer: "add-cloud",
  adduserstogroup: "add-user",
  addusertogroup: "add-group",
  addworkingstorage: "add-database",
  adminconfirmsignup: "check",
  admindeleteuser: "remove-user",
  admindeleteuserattributes: "remove-user",
  admindisableuser: "minus",
  admingetuser: "list",
  adminlistgroupsforuser: "list",
  adminremoveuserfromgroup: "remove-user",
  adminresetuserpassword: "reload",
  adminsetusersettings: "plus",
  adminupdateuserattributes: "plus",
  alertmanager: "prometheus",
  authenticateuser: "toggle-on",
  authorizesecuritygroupingress: "add-firewall",
  backoff: "snail",
  bindgithubaccounttokentoapplication: "git",
  build: "console",
  buildsuggesters: "cmd",
  bulkpublish: "upload",
  catalogsource: "operatorframework",
  certificateissued: "certificate",
  clusterissuer: "cert-manager",
  clusterservicerevision: "kubernetes",
  controllerrevision: "kubernetes",
  cost: "dollar",
  createaccesskey: "add-key",
  createbackup: "add-snapshot",
  createbucket: "add-node",
  createcase: "add-ticket",
  createcertificate: "add-certificate",
  createcluster: "add-node",
  createclustersnapshot: "add-snapshot",
  createcollection: "add-group",
  createcomment: "add-comment",
  createcomputeenvironment: "add-node",
  createcomputer: "add-node",
  createcontainer: "add-node",
  createdatabase: "add-database",
  createdataset: "add-database",
  createdatasetcontent: "add-database",
  createdatasource: "add-database",
  createdatasourcefromrds: "add-database",
  createdatasourcefromredshift: "add-database",
  createdatasourcefroms3: "add-database",
  createdatastore: "add-database",
  createdbcluster: "add-node",
  createdbinstance: "add-node",
  createdbinstancereadreplica: "add-database",
  createdbsnapshot: "add-snapshot",
  createdocument: "add-page",
  createdocumentationpart: "add-page",
  createdocumentationversion: "add-page",
  createfolder: "add-folder",
  createhealthcheck: "add-alert",
  createimage: "add-snapshot",
  createinstance: "add-node",
  createinstances: "add-node",
  createinstancesfromsnapshot: "add-node",
  createinstancesnapshot: "add-snapshot",
  createloggroup: "add-group",
  createloginprofile: "add-user",
  createmailuser: "add-gr",
  createmembers: "add-group",
  createoptiongroup: "add-group",
  createsecuritygroup: "add-firewall",
  createsnapshot: "add-snapshot",
  createuser: "add-user",
  createvault: "add-key",
  createvolume: "add-node",
  csidriver: "csi",
  csinode: "csi",
  deactivatemfadevice: "toggle-off",
  deactivatepipeline: "toggle-off",
  deactivateuser: "remove-user",
  deleteaccesskey: "remove-key",
  deletealarms: "remove-clock",
  deletearchive: "remove-snapshot",
  deletebucket: "remove-folder",
  deletebucketcors: "remove-shield",
  deletecachecluster: "remove-node",
  deleteclientcertificate: "remove-shield",
  deletecluster: "remove-node",
  deleteclustersnapshot: "remove-snapshot",
  deletecollection: "remove-group",
  deletecomment: "remove-comment",
  deletecomputeenvironment: "remove-node",
  deletecontainer: "remove-node",
  deletedatabase: "remove-database",
  deletedbcluster: "remove-node",
  deletedbinstance: "remove-database",
  deletedbparametergroup: "remove-shield",
  deletedbsecuritygroup: "remove-shield",
  deletedocument: "remove-page",
  deletedocumentationpart: "remove-page",
  deletedocumentationversion: "remove-page",
  deleteemailchannel: "remove-email",
  deletefilter: "remove-filter",
  deletefolder: "remove-folder",
  deletefoldercontent: "remove-folder",
  deletefoldercontents: "remove-folder",
  deletefoldershare: "remove-link",
  deletegroup: "remove-group",
  deleteinstance: "remove-node",
  deleteinstancesnapshot: "remove-snapshot",
  deleteinvitations: "remove-email",
  deletekeypair: "remove-key",
  deletemembers: "remove-group",
  deletesnapshot: "remove-snapshot",
  deletesnapshotschedule: "remove-schedule",
  deletesshpublickey: "remove-key",
  deletetags: "remove-tag",
  deletetagsfordomain: "remove-tag",
  deleteuser: "remove-user",
  deleteuserpolicy: "remove-shield",
  deletevolume: "remove-node",
  deletevpc: "remove-node",
  deletevpclink: "remove-link",
  deletevpcpeeringconnection: "remove-link",
  deletevpnconnection: "remove-link",
  deletevpnconnectionroute: "remove-link",
  deletevpngateway: "remove-link",
  deliverconfigsnapshot: "check",
  detachvolume: "down-database",
  deployment: "rocket",
  disablealarmactions: "remove-alarm",
  drain: "scale-in",
  dryrunevent: "cmd",
  enablemfadevice: "mfa",
  endpoints: "endpoint",
  endsecretversiondelete: "cancel",
  ensuredloadbalancer: "ok",
  createloadbalancer: "loadbalancer",
  detatchvolume: "down-database",
  ensuringloadbalancer: "hourglass",
  enterstandby: "pause",
  estimatetemplatecost: "cost",
  evictionthresholdmet: "alarm",
  externalexpanding: "hourglass",
  failoverdbcluster: "database2",
  file: "cfg",
  filesystemresizerequired: "hourglass",
  filesystemresizesuccessful: "scale-up",
  freediskspacefailed: "error-database",
  generated: "plus",
  gitoperationfailed: "error",
  gitoperationsucceeded: "ok",
  healthy: "heart",
  installplan: "helm",
  isemailreachable: "check",
  issuer: "cert-manager",
  issuing: "hourglass",
  isvpcpeered: "check",
  kibana: "elasticsearch",
  kustomization: "kustomize",
  leaderelection: "check",
  leaveorganization: "minus",
  memory: "mem",
  mergedeveloperidentities: "group",
  mergeshards: "folder-git",
  msplanner: "msplanner",
  mutatingwebhookconfiguration: "webhook",
  new: "plus",
  nodehasnodiskpressure: "check-database",
  nodehassufficientmemory: "ok",
  nodehassufficientpid: "ok",
  nodenotready: "broken-heart",
  nodenotschedulable: "hourglass",
  nodeready: "heart",
  nopods: "hourglass",
  nosourceartifact: "hourglass",
  notifymigrationtaskstate: "settings",
  nottriggerscaleup: "error",
  oipa: "oracle_icon",
  ordercreated: "plus",
  paginatedorganizationactivity: "settings",
  peervpc: "link",
  ping: "start",
  pipelinerun: "azure-devops-pipeline",
  podmonitor: "prometheus",
  policyexecutionevent: "start",
  preemptscheduled: "remove",
  process: "cmd",
  processingerror: "error",
  progressing: "hourglass",
  provisioningfailed: "error",
  provisioningsucceeded: "ok",
  pulled: "check-docker",
  pulling: "docker-pull",
  recreatingfailedpod: "reload",
  redeempromocode: "plus",
  redeployscheduled: "schedule",
  removeattributesfromfindings: "remove-list",
  removeiproutes: "remove-list",
  removemembersfromgroup: "remove-group",
  removerolefromdbcluster: "remove-node",
  removetargets: "remove-tag",
  removethingfromthinggroup: "remove-tag",
  removeuserfromgroup: "remove-user",
  resizing: "scale-up",
  reused: "recycle",
  revokesecuritygroupingress: "remove-firewall",
  rotationfailed: "cancel",
  rotationstarted: "start",
  rotationsucceeded: "check",
  scalingreplicaset: "scale-out",
  scheduled: "schedule",
  servicemonitor: "prometheus",
  sourceunavailable: "hourglass",
  success: "ok",
  successfulattachvolume: "ok",
  taintmanagereviction: "trash",
  unhealthy: "broken-heart",
  validatingwebhookconfiguration: "webhook",
  vmeventscheduled: "schedule",
  volumeresizefailed: "error-database",
  waitingforapproval: "wait-for-approval"
} as const;

var prefixes: IconMap = {
  pending: "hourglass",
  wait: "hourglass",
  abort: "stop",
  accept: "check",
  acknowledge: "check",
  activate: "toggle-on",
  add: "plus",
  allocate: "plus",
  apply: "settings",
  approve: "check",
  assign: "plus",
  associate: "plus",
  attach: "plus",
  authorize: "add-shield",
  bundle: "package-install",
  cancel: "cancel",
  change: "edit",
  check: "check",
  clear: "trash",
  clone: "clone",
  complete: "check",
  configure: "settings",
  confirm: "check",
  connect: "link",
  continue: "start",
  copy: "clone",
  create: "plus",
  decrease: "minus",
  delete: "trash",
  // deprecate: "trash",
  deregister: "remove",
  describe: "list",
  detach: "remove",
  disable: "toggle-off",
  disassociate: "remove",
  disconnect: "remove-link",
  discover: "search",
  download: "download",
  enable: "edit",
  evaluate: "filter",
  evicted: "trash",
  execute: "cmd",
  exit: "cancel",
  failed: "error",
  flush: "trash",
  get: "list",
  git: "git",
  grafana: "grafana",
  grant: "plus",
  helm: "helm",
  import: "plus",
  increase: "plus",
  increment: "plus",
  index: "search",
  initiate: "start",
  install: "package-install",
  invoke: "cmd",
  isdown: "broken-heart",
  issue: "check",
  isup: "heart",
  killing: "stop",
  lookup: "search",
  modify: "edit",
  monitor: "graph",
  move: "settings",
  operator: "operatorframework",
  poll: "list",
  post: "upload",
  preview: "show",
  prometheus: "prometheus",
  promote: "upload",
  provisioning: "hourglass",
  publish: "upload",
  purchase: "add-cost",
  push: "upload",
  put: "upload",
  query: "search",
  read: "list",
  reboot: "reload",
  rebuild: "reload",
  record: "plus",
  refresh: "reload",
  register: "plus",
  reject: "reject",
  release: "remove-link",
  reload: "reload",
  remove: "trash",
  removetag: "remove-tag",
  rename: "edit",
  renew: "reload",
  replace: "reload",
  report: "list",
  scheduled: "schedule",
  enabled: "on",
  disabled: "off",
  request: "send",
  resent: "reload",
  reset: "reload",
  resolve: "check",
  restart: "reload",
  uptodate: "ok",
  new: "plus",
  restore: "reload",
  resume: "start",
  resync: "reload",
  retrieve: "download",
  retry: "reload",
  revoke: "access-denied",
  rotate: "reload",
  run: "cmd",
  sample: "cmd",
  scan: "search",
  set: "edit",
  shutdown: "stop",
  signal: "cmd",
  simulate: "cmd",
  skip: "skip",
  split: "split",
  start: "start",
  stop: "stop",
  submit: "plus",
  subscribe: "mail",
  succeeded: "check",
  Success: "check",
  suspend: "toggle-off",
  swap: "switch",
  switch: "switch",
  synthesize: "plus",
  tag: "tag",
  terminate: "stop",
  test: "test",
  transfer: "switch",
  unarchive: "reload",
  unassign: "remove-link",
  unlink: "remove-link",
  unlock: "unlock",
  unmonitor: "stop",
  unpeer: "remove-link",
  unregister: "remove",
  unsubscribe: "minus",
  untag: "remove-tag",
  update: "edit",
  upgrade: "upload",
  upload: "upload",
  validate: "cmd",
  verify: "check",
  view: "show",
  wipe: "trash"
};

function findByName(name?: string) {
  if (isEmpty(name) || !name) {
    return undefined;
  }

  name = name
    .replaceAll("--", "-")
    .replaceAll("::", "-")
    .toLowerCase()
    .replaceAll("k8-", "k8s-")
    .replaceAll("kubernetes-", "k8s-");
  if (aliases[name as keyof typeof aliases]) {
    name = aliases[name as keyof typeof aliases];
  }

  if (aliases[name as keyof typeof aliases]) {
    name = aliases[name as keyof typeof aliases];
  }
  var icon = Icons[name as keyof typeof Icons];

  if (icon == null) {
    icon = Icons[("aws-" + name) as keyof typeof Icons];
  } else if (icon != null) {
    return icon;
  }
  if (icon == null) {
    icon = Icons[("azure-" + name) as keyof typeof Icons];
  } else if (icon != null) {
    return icon;
  }
  if (icon == null) {
    icon = Icons[("k8s-" + name) as keyof typeof Icons];
  } else if (icon != null) {
    return icon;
  }

  for (let prefix in prefixes) {
    if (name.startsWith(prefix)) {
      icon = Icons[prefixes[prefix] as keyof typeof Icons];
      return icon;
    }
  }
  for (let prefix in prefixes) {
    if (name.endsWith(prefix)) {
      icon =
        Icons[prefixes[prefix as keyof typeof Icons] as keyof typeof Icons];
      return icon;
    }
  }
  console.log(name, icon == null);

  return icon;
}

export type IconProps = {
  name?: string;
  secondary?: string;
  className?: string;
  alt?: string;
  icon?: string | { src: string };
  prefix?: React.ReactNode;
};

export const Icon: React.FC<IconProps> = memo(
  ({
    name,
    secondary = "", // If icon by name is not found, try the secondary (fallthrough) name
    className = "w-5 h-auto",
    alt = "",
    icon,
    prefix = undefined,
    ...props
  }) => {
    if (isEmpty(name) && isEmpty(secondary)) {
      return null;
    }

    if (name && (name.startsWith("http:") || name.startsWith("https://"))) {
      icon = name;
    }
    icon = findByName(name);
    if (icon == null) {
      icon = findByName(secondary);
    }

    if (icon == null) {
      console.warn("Icon not found: " + name);
      return null;
    }

    const src =
      typeof (icon as unknown as { src: string })?.src === "string"
        ? (icon as unknown as { src: string }).src
        : (icon as string);

    if (src) {
      return (
        <>
          {prefix}
          <img
            alt={alt}
            src={src}
            className={`inline-block object-center ${className}`}
            {...props}
          />
        </>
      );
    }

    const Icon = icon as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

    return icon ? (
      <>
        {prefix} <Icon className={className} {...props} />
      </>
    ) : null;
  }
);

type AvatarProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  url: string;
  alt?: string;
};

export function Avatar({ url, alt = "", ...props }: AvatarProps) {
  return (
    <img
      className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
      src={url}
      alt={alt}
      {...props}
    />
  );
}
