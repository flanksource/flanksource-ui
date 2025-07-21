import { IconType } from "@flanksource/icons";
import { IconMap as Icons } from "@flanksource/icons/mi";
import { isEmpty } from "lodash";

type IconMap = Record<string, string>;

type IconData = {
  SVG: IconType;
  iconName: string;
};
export const aliases: IconMap = {
  anthropic: "anthropic",
  openai: "openai",
  ollama: "ollama",
  aws_s3: "aws-s3",
  aws_kms: "aws-kms",
  gemini: "gemini",
  gcp_kms: "gcp-kms",
  azure_key_vault: "azure-key-vault",
  // GCP type mappings
  "gcp-address": "gcp-compute-engine",
  "gcp-alertpolicy": "gcp-cloud-monitoring",
  "gcp-apikeys-key": "gcp-key-management-service",
  "gcp-bucket": "gcp-cloud-storage",
  "gcp-cloudkms-cryptokeyversion": "gcp-key-management-service",
  "gcp-cryptokey": "gcp-key-management-service",
  "gcp-disk": "gcp-persistent-disk",
  "gcp-dns-resourcerecordset": "gcp-cloud-dns",
  "gcp-firewall": "gcp-cloud-firewall-rules",
  "gcp-forwardingrule": "gcp-cloud-load-balancing",
  "gcp-gkecluster": "gcp-google-kubernetes-engine",
  "gcp-httphealthcheck": "gcp-compute-engine",
  "gcp-iam-serviceaccountkey": "gcp-identity-and-access-management",
  "gcp-instance": "gcp-compute-engine",
  "gcp-instancegroup": "gcp-compute-engine",
  "gcp-instancegroupmanager": "gcp-compute-engine",
  "gcp-instancetemplate": "gcp-compute-engine",
  "gcp-keyring": "gcp-key-management-service",
  "gcp-logbucket": "gcp-cloud-logging",
  "gcp-logsink": "gcp-cloud-logging",
  "gcp-managedzone": "gcp-cloud-dns",
  "gcp-network": "gcp-virtual-private-cloud",
  "gcp-nodepool": "gcp-google-kubernetes-engine",
  "gcp-notificationchannel": "gcp-cloud-monitoring",
  "gcp-project": "gcp-project",
  "gcp-projectbillinginfo": "gcp-billing",
  "gcp-pubsub-topic": "gcp-pubsub",
  "gcp-resourcemanager-project": "gcp-project",
  "gcp-route": "gcp-cloud-routes",
  "gcp-router": "gcp-cloud-router",
  "gcp-serviceaccount": "gcp-identity-and-access-management",
  "gcp-serviceaccountkey": "gcp-identity-and-access-management",
  "gcp-servicedirectory-endpoint": "gcp-service-discovery",
  "gcp-servicedirectory-namespace": "gcp-service-discovery",
  "gcp-servicedirectory-service": "gcp-service-discovery",
  "gcp-subnetwork": "gcp-virtual-private-cloud",
  "gcp-subscription": "gcp-pubsub",
  "gcp-targetpool": "gcp-cloud-load-balancing",
  kubernetes_resource: "k8s",
  generic_webhook: "webhook",
  azure_devops: "azure-devops",
  acr: "azure-acr",
  "add-comment": "talk",
  "activemq-icon": "activemq",
  "aws-ec2-routetable": "aws-ec2-route-table",
  "aws-ecs-cluster": "aws-ecs",
  "aws-ecs-service": "aws-ecs",
  "aws-ecs-task": "aws-ecs",
  aks: "azure-aks",
  "aws-account": "aws",
  "aws-sns-topic": "aws-sns",
  "aws-sqs-queue": "aws-sqs",
  "aws-lambda-function": "aws-lambda",
  "aws-cloudformation-stack": "aws-cloudformation",
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
  "aws-iam-user": "user",
  "k8s-applicationset": "argo",
  "aws-iam-role": "role",
  "aws-iam-instanceprofile": "aws-iam-role",
  "aws-ebs-volume": "aws-ebs",
  "aws-eks-fargateprofile": "aws-fargate",
  "aws-ecr-repository": "aws-ecr",
  "k8s-ec2nodeclass": "aws-ec2",
  "k8s-nodepool": "karpenter",
  "k8s-rabbitmqcluster": "rabbitmq",
  "k8s-scaledobject": "keda",
  "k8s-nodeclaim": "karpenter",
  "aws-ec2-vpc": "aws-vpc",
  "aws-eks-cluster": "aws-eks",
  "aws-route53-hostedzone": "aws-route53",
  "aws-ec2-instance": "aws-ec2",
  "aws-ec2-subnet": "network",
  "k8s-volumeattachment": "k8s-vol",
  "aws-elasticloadbalancing-loadbalancer": "aws-elb",
  "aws-elasticloadbalancingv2-loadbalancer": "aws-alb",
  "aws-instance": "aws-ec2-instance",
  "aws-region": "datacenter",
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
  deletingnode: "trash",
  invaliddiskcapacity: "warning",
  resourceupdated: "edit",
  preempted: "stop",
  networknotready: "broken-heart",
  removingnode: "trash",
  runinstances: "start",
  synced: "check",
  "ec2-subnet": "network",
  recreatingterminatedpod: "reload",
  invalidiskcapacity: "warning",
  sawcompletedjob: "check",
  upgradefailed: "error",
  snapshotcreated: "check",
  creatingsnapshot: "plus",
  snapshotready: "heart",
  "elasticloadbalancing-loadbalancer": "aws-elb",
  fluentbit: "fluentd",
  "google chat": "google-chat",
  "google cloud": "google-cloud",
  google_cloud: "google-cloud",
  gcs: "google-cloud",
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
  accept: "checkmark",
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
  backofflimitexceeded: "snail",
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
  pulling: "docker",
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
  wipe: "trash",
  healthcheckpassed: "heart",
  healthunknown: "help",
  upgradesucceeded: "ok",
  healthcheckfailed: "broken-heart",
  // initialized:
  podcrashed: "dead",
  podcrashlooping: "dead",
  warning: "error",
  // launched:
  nodehasdiskpressure: "disk-error",
  nodehasnodiskpressure: "ok",
  nodehassufficientcpu: "ok",
  subscribe: "add",
  unsubscribe: "remove",
  // nominated:
  // exceededgraceperiod
  dependencynotready: "hourglass",
  "k8s-redisinstance": "redis",
  oomkilled: "memory-error",
  oomkilling: "memory-error",
  updating: "hourglass"
} as const;

export var prefixes: IconMap = {
  disruption: "stop",
  garbage: "trash",
  verified: "check",
  cannot: "warning",
  ready: "check",
  notready: "broken-heart",
  cilium: "cilium",
  pending: "hourglass",
  invalid: "error",
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
  missioncontrol: "mission-control",
  modify: "edit",
  monitor: "graph",
  move: "settings",
  operator: "operatorframework",
  playbook: "playbook",
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
  untag: "remove-tag",
  update: "edit",
  upgrade: "upload",
  upload: "upload",
  validate: "cmd",
  verify: "check",
  view: "show",
  wipe: "trash"
};

export function findIconName(name?: string): IconData | undefined {
  if (isEmpty(name) || !name) {
    return undefined;
  }

  let icon = Icons[name as keyof typeof Icons];
  if (icon != null) {
    return { SVG: icon, iconName: name };
  }

  if (aliases[name as keyof typeof aliases]) {
    const aliasedName = aliases[name];
    const aliasedIcon = Icons[aliasedName as keyof typeof Icons];
    if (aliasedIcon) {
      return { SVG: aliasedIcon, iconName: aliasedName };
    }
  }

  for (let prefix in prefixes) {
    if (name.startsWith(prefix)) {
      const prefixIcon = Icons[prefixes[prefix] as keyof typeof Icons];
      if (prefixIcon) {
        return { SVG: prefixIcon, iconName: prefixes[prefix] };
      }
    }
  }

  for (let prefix in prefixes) {
    if (name.endsWith(prefix)) {
      const prefixIcon =
        Icons[prefixes[prefix as keyof typeof Icons] as keyof typeof Icons];
      if (prefixIcon) {
        return { SVG: prefixIcon, iconName: prefixes[prefix] };
      }
    }
  }

  return undefined;
}

export function processIconNameSearch(name: string): string {
  return name
    .replaceAll("--", "-")
    .replaceAll("::", "-")
    .toLowerCase()
    .replaceAll("k8-", "k8s-")
    .replaceAll("kubernetes-", "k8s-");
}

export function areTwoIconNamesEqual(
  firstIconName?: string,
  secondIconName?: string
) {
  if (!firstIconName || !secondIconName) {
    return false;
  }

  const firstIcon = processIconNameSearch(firstIconName);
  const secondIcon = processIconNameSearch(secondIconName);
  if (firstIcon === secondIcon) {
    return true;
  }
  // ensure they aren't aliased to each other
  const firstIconAlias = aliases[firstIcon as keyof typeof aliases];
  const secondIconAlias = aliases[secondIcon as keyof typeof aliases];

  if (firstIconAlias === secondIcon || secondIconAlias === firstIcon) {
    return true;
  }
  if (firstIconAlias === secondIconAlias) {
    return true;
  }

  // replace k8s with nothing
  if (firstIcon.replace("k8s-", "") === secondIcon) {
    return true;
  }

  if (secondIcon.replace("k8s-", "") === firstIcon) {
    return true;
  }

  if (firstIcon.replace("k8s-", "") === secondIcon.replace("k8s-", "")) {
    return true;
  }

  return false;
}

export function findByName(name?: string): IconData | undefined {
  if (isEmpty(name) || !name) {
    return undefined;
  }

  name = processIconNameSearch(name);

  var icon = findIconName(name);

  if (icon != null) {
    return icon;
  }

  icon = findIconName(name.replace("k8s-", ""));

  if (icon != null) {
    return icon;
  }

  if (icon == null) {
    icon = findIconName("aws-" + name);
  } else if (icon != null) {
    return icon;
  }
  if (icon == null) {
    icon = findIconName("azure-" + name);
  } else if (icon != null) {
    return icon;
  }
  if (icon == null) {
    icon = findIconName("k8s-" + name);
  } else if (icon != null) {
    return icon;
  }

  return icon;
}

const colorClassMap = {
  error: "fill-red-500",
  success: "fill-green-500",
  healthy: "fill-green-500",
  unhealthy: "fill-red-500",
  warning: "fill-orange-500",
  unknown: "fill-gray-500",
  orange: "fill-orange-500",
  red: "fill-red-500",
  green: "fill-green-500",
  blue: "fill-blue-500",
  gray: "fill-gray-500"
} satisfies Readonly<Record<string, string>>;

export type IconProps = {
  name?: string;
  secondary?: string;
  className?: string;
  alt?: string;
  prefix?: any;
  size?: any;
  iconWithColor?: string;
};

type IconCache = {
  iconData?: IconData;
  color?: string;
};

const cache: Record<string, IconCache> = {};

function findIcon(
  name: string,
  secondary: string,
  iconWithColor?: string
): IconCache | undefined {
  const key = `${name}-${secondary}-${iconWithColor}`;
  if (cache[key]) {
    return cache[key];
  }
  if (iconWithColor) {
    const [icon, color] = iconWithColor.split(":");
    if (icon) {
      const iconData = findByName(icon);
      if (iconData) {
        let value: IconCache = {
          iconData: iconData,
          color: colorClassMap[color as keyof typeof colorClassMap]
        };
        cache[key] = value;
        return value;
      }
    }
  }

  if (!name && !secondary) {
    return undefined;
  }

  if (name && (name.startsWith("http:") || name.startsWith("https://"))) {
    return undefined;
  }

  let iconData = findByName(name);
  if (!iconData) {
    iconData = findByName(secondary);
  }

  const result: IconCache = {
    iconData: iconData
  };

  cache[key] = result;

  return result;
}
export function Icon({
  name = "",
  secondary = "", // If icon by name is not found, try the secondary (fallthrough) name
  className = "h-6 max-w-6",
  alt = "",
  prefix,
  iconWithColor,
  ...props
}: IconProps) {
  if (name && (name.startsWith("http:") || name.startsWith("https://"))) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={name} className={className} alt={alt} {...props} />;
  }

  const Icon = findIcon(name, secondary, iconWithColor);

  if (!Icon || !Icon.iconData) {
    return null;
  }

  const isGcpIcon = Icon.iconData.iconName.toLowerCase().startsWith("gcp-");

  // Don't apply fill-current to GCP icons to preserve their original colors
  const fillClass = isGcpIcon ? "" : "fill-current";

  return (
    <>
      {prefix}{" "}
      <Icon.iconData.SVG
        className={`inline-block ${fillClass} object-center ${className} ${Icon.color ?? ""}`}
        {...props}
      />
    </>
  );
}
