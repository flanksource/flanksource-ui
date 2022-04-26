import { LogsViewer } from "./index";

export default {
  title: "LogsViewer",
  component: LogsViewer
};

const logsExample = [
  {
    timestamp: "2022-02-08T16:11:53.795232458Z",
    message:
      "Application startup exception: Volo.Abp.Http.Client.AbpRemoteCallException: An internal error occurred during your request!",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795279759Z",
    message:
      "at Volo.Abp.Http.Client.DynamicProxying.DynamicHttpProxyInterceptor`1.ThrowExceptionForResponseAsync(HttpResponseMessage response) in /src/framework/src/Volo.Abp.Http.Client/Volo/Abp/Http/Client/DynamicProxying/DynamicHttpProxyInterceptor.cs:line 255",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795287689Z",
    message:
      "at Volo.Abp.Http.Client.DynamicProxying.DynamicHttpProxyInterceptor`1.MakeRequestAsync(IAbpMethodInvocation invocation) in /src/framework/src/Volo.Abp.Http.Client/Volo/Abp/Http/Client/DynamicProxying/DynamicHttpProxyInterceptor.cs:line 163",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795292056Z",
    message:
      "at Volo.Abp.Http.Client.DynamicProxying.DynamicHttpProxyInterceptor`1.MakeRequestAndGetResultAsync[T](IAbpMethodInvocation invocation) in /src/framework/src/Volo.Abp.Http.Client/Volo/Abp/Http/Client/DynamicProxying/DynamicHttpProxyInterceptor.cs:line 118",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795296005Z",
    message:
      "at Volo.Abp.Castle.DynamicProxy.CastleAbpInterceptorAdapter`1.ExecuteWithReturnValueAsync[T](IInvocation invocation, IInvocationProceedInfo proceedInfo)",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795299436Z",
    message:
      "at Volo.Abp.AspNetCore.Mvc.Client.CachedApplicationConfigurationClient.<GetAsync>b__14_0() in /src/framework/src/Volo.Abp.AspNetCore.Mvc.Client/Volo/Abp/AspNetCore/Mvc/Client/CachedApplicationConfigurationClient.cs:line 46",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795303358Z",
    message:
      "at Volo.Abp.Caching.DistributedCache`1.GetOrAddAsync(String key, Func`1 factory, Func`1 optionsFactory, Nullable`1 hideErrors, CancellationToken token)",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795306633Z",
    message:
      "at Volo.Abp.AspNetCore.Mvc.Client.CachedApplicationConfigurationClient.GetAsync() in /src/framework/src/Volo.Abp.AspNetCore.Mvc.Client/Volo/Abp/AspNetCore/Mvc/Client/CachedApplicationConfigurationClient.cs:line 44",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795309711Z",
    message:
      "at Volo.Abp.AspNetCore.Mvc.Client.RemoteLanguageProvider.GetLanguagesAsync() in /src/framework/src/Volo.Abp.AspNetCore.Mvc.Client/Volo/Abp/AspNetCore/Mvc/Client/RemoteLanguageProvider.cs:line 19",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795312905Z",
    message:
      "at Nito.AsyncEx.Synchronous.TaskExtensions.WaitAndUnwrapException[TResult](Task`1 task)",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795316095Z",
    message:
      "at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795320475Z",
    message:
      "at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795323876Z",
    message:
      "--- End of stack trace from previous location where exception was thrown ---",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795326931Z",
    message:
      "at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot)",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795330091Z",
    message:
      "--- End of stack trace from previous location where exception was thrown ---",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795333286Z",
    message:
      "at Nito.AsyncEx.Synchronous.TaskExtensions.WaitAndUnwrapException[TResult](Task`1 task)",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795336290Z",
    message: "at Nito.AsyncEx.AsyncContext.Run[TResult](Func`1 action)",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795339542Z",
    message:
      "at Microsoft.AspNetCore.Builder.AbpApplicationBuilderExtensions.UseAbpRequestLocalization(IApplicationBuilder app) in /src/framework/src/Volo.Abp.AspNetCore/Microsoft/AspNetCore/Builder/AbpApplicationBuilderExtensions.cs:line 55",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795343283Z",
    message:
      "at BackendAdminApp.Host.BackendAdminAppHostModule.OnApplicationInitialization(ApplicationInitializationContext context) in /src/samples/MicroserviceDemo/applications/BackendAdminApp.Host/BackendAdminAppHostModule.cs:line 101",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795352322Z",
    message:
      "at Volo.Abp.Modularity.ModuleManager.InitializeModules(ApplicationInitializationContext context) in /src/framework/src/Volo.Abp.Core/Volo/Abp/Modularity/ModuleManager.cs:line 39",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795355995Z",
    message:
      "at Volo.Abp.AbpApplicationBase.InitializeModules() in /src/framework/src/Volo.Abp.Core/Volo/Abp/AbpApplicationBase.cs:line 72",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795359415Z",
    message:
      "--- End of stack trace from previous location where exception was thrown ---",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795362566Z",
    message:
      "at Microsoft.AspNetCore.Hosting.ConventionBasedStartup.Configure(IApplicationBuilder app)",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795365651Z",
    message:
      "at Microsoft.AspNetCore.Mvc.Internal.MiddlewareFilterBuilderStartupFilter.<>c__DisplayClass0_0.<Configure>g__MiddlewareFilterBuilder|0(IApplicationBuilder builder)",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795369399Z",
    message:
      "at Microsoft.AspNetCore.Hosting.Internal.AutoRequestServicesStartupFilter.<>c__DisplayClass0_0.<Configure>b__0(IApplicationBuilder builder)",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.795372798Z",
    message:
      "at Microsoft.AspNetCore.Hosting.Internal.WebHost.BuildApplication()",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  },
  {
    timestamp: "2022-02-08T16:11:53.815029488Z",
    message: "Application is shutting down...",
    labels: {
      containerName: "backend-admin-app",
      namespace: "dev",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "backend-admin-app-6c4f67756c-wm8bl"
    }
  }
];

const Template = (arg) => <LogsViewer {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  logs: logsExample,
  isLoading: false
};
