import { isEmpty, memoize } from "lodash";
import { Icons } from "../../icons";
import React, { memo } from "react";

type IconMap = Record<string, string>;
export const aliases: IconMap = {
  acr: "azure-acr",
  "add-comment": "talk",
  "activemq-icon": "activemq",
  aks: "azure-aks",
  "aws-account": "aws",
  "k8s-loggingbackend": "mission-control",
  "k8s-application": "argo",
  "k8s-appproject": "argo",
  "k8s-flowschema": "calico",
  "k8s-provider": "k8s-customresourcedefinition",
  "k8s-priorityclass": "k8s-customresourcedefinition",
  "k8s-prioritylevelconfiguration": "k8s-customresourcedefinition",
  "k8s-sealedsecret": "k8s-secret",
  "aws-cloudwatch-alarm": "aws-cloudwatch-alarm",
  "aws-config-alarm": "aws-config",
  "aws-ec2-dhcpoptions": "settings",
  "aws-ec2-securitygroup": "aws-security-group",
  "ec2-securitygroup": "aws-security-group",
  "aws-ec2-subnet": "network",
  "k8s-volumeattachment": "k8s-vol",
  "aws-elasticloadbalancing-loadbalancer": "aws-elb",
  "aws-elasticloadbalancingv2-loadbalancer": "aws-alb",
  "aws-instance": "aws-ec2-instance",
  "aws-region": "aws",
  "aws-s3-bucket": "aws-s3",
  "aws-subnet": "network",
  "azure devops": "azure-devops",
  "azure-microsoft.advisor/recommendations": "azure-advisor",
  "azure-microsoft.compute/": "azure-vm",
  "azure-microsoft.compute/availabilitysets": "azure-availability-set",
  "azure-microsoft.compute/disks": "azure-disk",
  "azure-microsoft.compute/images": "azure-image",
  "azure-microsoft.compute/snapshots": "azure-disk-snapshot",
  "azure-microsoft.compute/virtualmachines": "azure-vm",
  "azure-microsoft.compute/virtualmachinescalesets": "azure-vm-scaleset",
  "azure-microsoft.containerregistry/registries": "azure-acr",
  "azure-microsoft.containerservice/": "azure-aks",
  "azure-microsoft.containerservice/managedclusters": "azure-aks",
  "azure-microsoft.containerservice/managedclusters/listclusteradmincredential/action":
    "login",
  "azure-microsoft.dbforpostgresql/flexibleservers": "azure-postgres",
  "azure-microsoft.network/": "azure-vnet",
  "azure-microsoft.network/azurefirewalls": "azure-firewall",
  "azure-microsoft.network/dnszones": "azure-dns",
  "azure-microsoft.network/loadbalancers": "azure-load-balancer",
  "azure-microsoft.network/natgateways": "azure-nat",
  "azure-microsoft.network/networkinterfaces": "azure-network-interface",
  "azure-microsoft.network/networksecuritygroups": "azure-acl",
  "azure-microsoft.network/privatednszones": "azure-dns",
  "azure-microsoft.network/privateendpoints": "azure-vnet",
  "azure-microsoft.network/publicipaddresses": "azure-ip",
  "azure-microsoft.network/routetables": "azure-route-table",
  "azure-microsoft.network/virtualnetworks": "azure-vnet",
  "azure-microsoft.network/vpngateways": "azure-vpn",
  "azure-microsoft.network/vpnserverconfigurations": "azure-vpn",
  "azure-microsoft.network/vpnsites": "azure-vpn",
  "azure-microsoft.resources/resourcegroups": "azure-resource-group",
  "azure-microsoft.storage/": "azure-storage",
  "azure-microsoft.storage/storageaccounts/blobservices": "azure-storage",
  "azure-sql": "azure-sql-server",
  "azuredevops-pipelinerun": "azure-devops-pipeline",
  bash: "console",
  "cert-manager.io": "cert-manager",
  cmd: "console",
  "ec2-subnet": "network",
  "elasticloadbalancing-loadbalancer": "aws-elb",
  fluentbit: "fluentd",
  "google chat": "google-chat",
  "google cloud": "gcp",
  "iam-instanceprofile": "server",
  "iam-role": "shield",
  "iam-user": "user",
  "k8s-alertmanager": "prometheus",
  "k8s-canary": "canary-checker",
  "k8s-certificate": "cert-manager",
  "k8s-certificaterequest": "cert-manager",
  "k8s-cluster": "k8s",
  "k8s-clusterissuer": "cert-manager",
  "k8s-connection": "mission-control",
  "k8s-felixconfiguration": "calico",
  "k8s-gitrepository": "flux",
  "k8s-globalnetworkpolicy": "calico", //crd.projectcalico.org/v1
  "k8s-helm": "helm",
  "k8s-ingressclass": "k8s-ingress",
  "k8s-endpoints": "k8s-endpoint",
  "k8s-issuer": "cert-manager",
  "k8s-kustomization": "kustomize",
  "k8s-playbook": "mission-control",
  "k8s-podmonitor": "prometheus",
  "k8s-prometheus": "prometheus",
  "k8s-prometheusrule": "prometheus",
  "k8s-scrapeconfig": "mission-control",
  "k8s-servicemonitor": "prometheus",
  "k8s-tigerastatus": "calico",
  "k8s-topology": "mission-control",
  kubernetes: "k8s",
  "mssql-database": "sqlserver",
  mssql: "sqlserver",
  nodes: "k8s-node",
  pods: "pod",
  s3: "aws-s3",
  s3bucket: "aws-s3",
  "sql server": "sqlserver",
  www: "http",
  "zulip chat": "zulip",
  // connection icons type aliases
  // deprecate: "trash",
  abort: "stop",
  accept: "check",
  acknowledge: "check",
  activate: "toggle-on",
  add: "plus",
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
  allocate: "plus",
  apply: "settings",
  approve: "check",
  assign: "plus",
  associate: "plus",
  attach: "plus",
  attachnetworkinterface: "add-network-card",
  attachrolepolicy: "add-shield",
  attachuserpolicy: "add-shield",
  attachvolume: "up-database",
  authenticateuser: "toggle-on",
  authorize: "add-shield",
  authorizesecuritygroupingress: "add-firewall",
  azuredevops: "azure-devops",
  backoff: "snail",
  bindgithubaccounttokentoapplication: "git",
  build: "console",
  buildsuggesters: "console",
  bulkpublish: "upload",
  bundle: "package-install",
  cancel: "cancel",
  catalogsource: "operatorframework",
  certificateissued: "certificate",
  change: "edit",
  check: "check",
  clear: "trash",
  clone: "clone",
  clusterissuer: "cert-manager",
  clusterservicerevision: "k8s",
  complete: "check",
  configure: "settings",
  confirm: "check",
  connect: "link",
  connection: "cog",
  continue: "start",
  controllerrevision: "k8s",
  copy: "clone",
  cost: "dollar",
  create: "plus",
  createaccesskey: "add-key",
  createbackup: "add-snapshot",
  createbucket: "add-node",
  createcase: "add-ticket",
  createcertificate: "add-certificate",
  createcluster: "add-node",
  createclustersnapshot: "add-snapshot",
  createcollection: "add-group",
  createcomment: "talk",
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
  createloadbalancer: "loadbalancer",
  createloggroup: "add-group",
  createloginprofile: "add-user",
  createmailuser: "add-user",
  createmembers: "add-group",
  createnetworkinterface: "add-network-card",
  createoptiongroup: "add-group",
  createrole: "add-shield",
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
  decrease: "minus",
  delete: "trash",
  deleteaccesskey: "remove-key",
  deletealarms: "remove-clock",
  deletearchive: "remove", //"remove-snapshot"
  deletebucket: "remove-folder",
  deletebucketcors: "remove-shield",
  deletecachecluster: "remove-node",
  deleteclientcertificate: "remove-shield",
  deletecluster: "remove-node",
  deleteclustersnapshot: "remove", //"remove-snapshot"
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
  deleteinstancesnapshot: "remove", //"remove-snapshot",
  deleteinvitations: "remove-email",
  deletekeypair: "remove-key",
  deletemembers: "remove-group",
  deletesnapshot: "remove", //"remove-snapshot",
  deletesnapshotschedule: "remove",
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
  deployment: "rocket",
  deregister: "remove",
  describe: "list",
  detach: "remove",
  detachnetworkinterface: "remove-network-card",
  detachrolepolicy: "remove-shield",
  detachuserpolicy: "remove-shield",
  detachvolume: "down-database",
  detatchvolume: "down-database",
  dettachvolume: "down-database",
  disable: "toggle-off",
  disablealarmactions: "remove-alarm",
  disabled: "off",
  disassociate: "remove",
  disconnect: "remove-link",
  discover: "search",
  download: "download",
  drain: "scale-in",
  dryrunevent: "console",
  enable: "edit",
  enabled: "on",
  enablemfadevice: "mfa",
  endpoints: "endpoint",
  endsecretversiondelete: "cancel",
  ensuredloadbalancer: "ok",
  ensuringloadbalancer: "hourglass",
  enterstandby: "pause",
  estimatetemplatecost: "dollar",
  evaluate: "filter",
  evicted: "trash",
  evictionthresholdmet: "alarm",
  execute: "console",
  exit: "cancel",
  externalexpanding: "hourglass",
  failed: "error",
  failoverdbcluster: "database",
  file: "cfg",
  filesystemresizerequired: "hourglass",
  filesystemresizesuccessful: "scale-up",
  flush: "trash",
  freediskspacefailed: "error-database",
  generated: "plus",
  get: "list",
  git: "git",
  gitoperationfailed: "error",
  gitoperationsucceeded: "ok",
  grafana: "grafana",
  grant: "plus",
  healthy: "heart",
  helm: "helm",
  import: "plus",
  increase: "plus",
  increment: "plus",
  index: "search",
  initiate: "start",
  install: "package-install",
  installplan: "helm",
  invoke: "console",
  isdown: "broken-heart",
  isemailreachable: "check",
  issue: "check",
  issuer: "cert-manager",
  issuing: "hourglass",
  isup: "heart",
  isvpcpeered: "check",
  keypairverified: "id-verified",
  kibana: "elasticsearch",
  killing: "stop",
  kustomization: "kustomize",
  leaderelection: "check",
  leaveorganization: "minus",
  lookup: "search",
  memory: "mem",
  mergedeveloperidentities: "group",
  mergeshards: "folder-git",
  modify: "edit",
  monitor: "graph",
  move: "settings",
  msplanner: "msplanner",
  mutatingwebhookconfiguration: "webhook",
  networkinterface: "network-card",
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
  operator: "operatorframework",
  ordercreated: "plus",
  paginatedorganizationactivity: "settings",
  peervpc: "link",
  pending: "hourglass",
  ping: "start",
  pipelinerun: "azure-devops-pipeline",
  policyexecutionevent: "start",
  poll: "list",
  post: "upload",
  preemptscheduled: "remove",
  preview: "show",
  process: "console",
  processingerror: "error",
  progressing: "hourglass",
  prometheus: "prometheus",
  promote: "upload",
  provisioning: "hourglass",
  provisioningfailed: "error",
  provisioningsucceeded: "ok",
  publish: "upload",
  pulled: "check-docker",
  pulling: "dockerPull",
  purchase: "add-cost",
  push: "upload",
  put: "upload",
  query: "search",
  read: "list",
  reboot: "reload",
  rebootscheduled: "schedule",
  rebuild: "reload",
  record: "plus",
  recreatingfailedpod: "reload",
  redeempromocode: "plus",
  redeployscheduled: "schedule",
  refresh: "reload",
  register: "plus",
  reject: "reject",
  release: "remove-link",
  reload: "reload",
  remove: "trash",
  removeattributesfromfindings: "remove-list",
  removeiproutes: "remove-list",
  removemembersfromgroup: "remove-group",
  removerolefromdbcluster: "remove-node",
  removetag: "remove-tag",
  removetargets: "remove-tag",
  removethingfromthinggroup: "remove-tag",
  removeuserfromgroup: "remove-user",
  rename: "edit",
  renew: "reload",
  replace: "reload",
  report: "list",
  request: "send",
  resent: "reload",
  reset: "reload",
  resizing: "scale-up",
  resolve: "check",
  restart: "reload",
  restore: "reload",
  resume: "start",
  resync: "reload",
  retrieve: "download",
  retry: "reload",
  reused: "recycle",
  revoke: "access-denied",
  revokesecuritygroupingress: "remove-firewall",
  rotate: "reload",
  rotationfailed: "cancel",
  rotationstarted: "start",
  rotationsucceeded: "check",
  run: "console",
  sample: "console",
  scalingreplicaset: "scale-out",
  scan: "search",
  scheduled: "schedule",
  servicemonitor: "prometheus",
  set: "edit",
  shutdown: "stop",
  signal: "console",
  simulate: "console",
  skip: "skip",
  sourceunavailable: "hourglass",
  split: "split",
  start: "start",
  statefulset: "k8s-statefulset",
  stop: "stop",
  submit: "plus",
  subscribe: "mail",
  succeeded: "check",
  Success: "check",
  success: "ok",
  successfulattachvolume: "ok",
  suspend: "toggle-off",
  swap: "switch",
  switch: "switch",
  synthesize: "plus",
  tag: "tag",
  taintmanagereviction: "trash",
  terminate: "stop",
  test: "test",
  transfer: "switch",
  unarchive: "reload",
  unassign: "remove-link",
  unhealthy: "broken-heart",
  unlink: "remove-link",
  unlock: "unlock",
  unmonitor: "stop",
  unpeer: "remove-link",
  unregister: "remove",
  unsubscribe: "minus",
  untag: "remove-tag",
  update: "edit",
  updatecertificate: "certificate",
  updatedloadbalancer: "loadbalancer",
  UpdateLoginProfile: "user",
  upgrade: "upload",
  upload: "upload",
  uptodate: "ok",
  validate: "cmd",
  validatingwebhookconfiguration: "webhook",
  verify: "check",
  view: "show",
  vmeventscheduled: "schedule",
  volumeresizefailed: "error-database",
  wait: "hourglass",
  waitingforapproval: "wait-for-approval",
  wipe: "trash"
} as const;

export var prefixes: IconMap = {
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

  "aws-iam": "aws-iam",
  "k8s-cni": "cni",

  grant: "plus",
  helm: "helm",
  "k8s-mutatingwebhookconfiguration": "webhook",
  "k8s-validatingwebhookconfiguration": "webhook",
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

const find = function (name?: string) {
  if (isEmpty(name) || !name) {
    return undefined;
  }

  let icon = Icons[name as keyof typeof Icons];
  if (icon != null) {
    return icon;
  }

  if (aliases[name as keyof typeof aliases]) {
    return Icons[aliases[name] as keyof typeof Icons];
  }

  for (let prefix in prefixes) {
    if (name.startsWith(prefix)) {
      return Icons[prefixes[prefix] as keyof typeof Icons];
    }
  }

  for (let prefix in prefixes) {
    if (name.endsWith(prefix)) {
      return Icons[
        prefixes[prefix as keyof typeof Icons] as keyof typeof Icons
      ];
    }
  }

  return undefined;
};

export const findByName = function (name?: string): string | undefined {
  if (isEmpty(name) || !name) {
    return undefined;
  }

  name = name
    .replaceAll("--", "-")
    .replaceAll("::", "-")
    .toLowerCase()
    .replaceAll("k8-", "k8s-")
    .replaceAll("kubernetes-", "k8s-");

  var icon = find(name);

  if (icon != null) {
    return icon;
  }

  icon = find(name.replace("k8s-", ""));

  if (icon != null) {
    return icon;
  }

  if (icon == null) {
    icon = find("aws-" + name);
  } else if (icon != null) {
    return icon;
  }
  if (icon == null) {
    icon = find("azure-" + name);
  } else if (icon != null) {
    return icon;
  }
  if (icon == null) {
    icon = find("k8s-" + name);
  } else if (icon != null) {
    return icon;
  }

  return icon;
};

export type IconProps = {
  name?: string;
  secondary?: string;
  className?: string;
  alt?: string;
  icon?: string | { src: string };
  prefix?: any;
};

export const Icon: React.FC<IconProps> = memo(
  ({
    name = "",
    secondary = "", // If icon by name is not found, try the secondary (fallthrough) name
    className = "w-5 h-auto",
    alt = "",
    icon,
    prefix,
    ...props
  }) => {
    if (isEmpty(name) && isEmpty(secondary)) {
      return null;
    }

    if (name && (name.startsWith("http:") || name.startsWith("https://"))) {
      icon = name;
    }
    icon = findByName(name!);
    if (icon == null) {
      icon = findByName(secondary);
    }

    if (icon == null) {
      console.log("Icon not found: " + name);
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
