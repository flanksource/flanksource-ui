# flanksource-ui

A Helm chart for flanksource-ui

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| affinity | object | `{}` |  |
| backendURL | string | `""` |  |
| enabled | bool | `true` |  |
| fullnameOverride | string | `"flanksource-ui"` |  |
| global.affinity | object | `{}` |  |
| global.imagePrefix | string | `"flanksource"` |  |
| global.imageRegistry | string | `"docker.io"` |  |
| global.labels | object | `{}` |  |
| global.nodeSelector | object | `{}` | node's labels for the pod to be scheduled on that node. See [Node Selector](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/) |
| global.tolerations | list | `[]` |  |
| image.name | string | `"{{.Values.global.imagePrefix}}/incident-manager-ui"` |  |
| image.pullPolicy | string | `"IfNotPresent"` |  |
| image.tag | string | `"latest"` |  |
| imagePullSecrets | list | `[]` |  |
| ingress.annotations | object | `{}` |  |
| ingress.className | string | `""` |  |
| ingress.enabled | bool | `false` |  |
| ingress.host | string | `"incident-commander-ui.local"` |  |
| ingress.tls | list | `[]` |  |
| nameOverride | string | `"flanksource-ui"` |  |
| nodeSelector | object | `{}` | node's labels for the pod to be scheduled on that node. See [Node Selector](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/) |
| oryKratosURL | string | `""` |  |
| podAnnotations | object | `{}` |  |
| podSecurityContext | object | `{}` |  |
| replicas | int | `1` |  |
| resources.limits.memory | string | `"2Gi"` |  |
| resources.requests.cpu | string | `"200m"` |  |
| resources.requests.memory | string | `"200Mi"` |  |
| securityContext | object | `{}` |  |
| service.type | string | `"ClusterIP"` |  |
| serviceAccount.annotations | object | `{}` |  |
| serviceAccount.name | string | `"flanksource-ui-sa"` |  |
| tolerations | list | `[]` |  |

## Maintainers

| Name | Email | Url |
| ---- | ------ | --- |
| Flanksource |  | <https://www.flanksource.com> |
