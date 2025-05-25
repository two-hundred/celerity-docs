---
sidebar_position: 5
---

# Compute Configuration

**v2025-08-01 (draft)**

Celerity applications can be composed of multiple compute resources that represent different interfaces for an application. These compute resources share common configuration specific to a deployment target that can be defined in the [app deploy configuration file](/cli/docs/app-deploy-configuration).

This document describes configuration that can be used to fine-tune the underlying compute resources for the `celerity/api`, `celerity/consumer`, `celerity/schedule` and `celerity/workflow` resource types.

The following configuration options can be set in the `deployTarget.config` object in the app deploy configuration file.

## AWS Configuration Options

The following configuration options are specific to the `aws` target environment.

### aws.compute.containerService

Determine the container service to use when deploying to the `aws` target environment.

**Type**

string

**Deploy Targets**

`aws`

**Allowed Values**

`ecs` | `eks`

**Default Value**

`ecs`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.containerService": "eks"
    }
  }
}
```

### aws.compute.launchType

Determine the launch type to use when deploying to the `aws` target environment.

**Type**

string

**Deploy Targets**

`aws`

**Allowed Values**

`ec2` | `fargate`

**Default Value**

`ec2`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.launchType": "fargate"
    }
  }
}
```

### aws.compute.instanceType

Determine the instance type to use when deploying to the `aws` target environment.
This is used for both `ecs` and `eks` container services when the launch type is `ec2`.
Scaling behaviour for Celerity applications use the instance type as a part of the "launch template" to scale the underlying EC2 instances horizontally.

This will override the default instance type for the application that is derived from `celerity/handler` resources in the application blueprint.

**Type**

string

**Deploy Targets**

`aws`

**Allowed Values**

See [AWS EC2 Instance Types](https://aws.amazon.com/ec2/instance-types/) to explore available instance types.

**Default Value**

The default instance type is determined by the compute needs of the application defined for the `celerity/handler` resources used in the application.
If no compute needs are defined in the blueprint, the `t3.small` instance type will be used for development app environments and the `t3.medium` instance type will be used for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.instanceType": "t3.medium"
    }
  }
}
```

### aws.compute.esc.minInstances

Determine the minimum number of instances to run for the ECS service when deploying to the `aws` target environment and the container service is `ecs`.
This is used when the launch type is `ec2`.

**Type**

number

**Deploy Targets**

`aws`

**Default Value**

`1`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.minInstances": 2
    }
  }
}
```

### aws.compute.ecs.maxInstances

Determine the maximum number of instances to run for the ECS service when deploying to the `aws` target environment and the container service is `ecs`.
This is used when the launch type is `ec2`.

**Type**

number

**Deploy Targets**

`aws`

**Default Value**

`3` for development app environments and `6` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.maxInstances": 5
    }
  }
}
```

### aws.compute.ecs.scalePolicyType

Determine the scale policy type to use when deploying to the `aws` target environment
and the container service is `ecs`.
If the ECS deployment is backed by EC2 instances, the scale policy type will also apply to the EC2 instances.
If you want to manage scaling tasks and instances separately, you can set the `aws.compute.ecs.scalePolicyType` to `None` and manage the scaling of tasks from a separate blueprint with provider-specific IaC, using the AWS console or another tool.
For example, if you want to use custom metrics for predictive scaling, you'll want to switch off built-in auto-scaling and manage it separately.

**Type**

string

**Deploy Targets**

`aws`

**Allowed Values**

`TargetTracking` | `StepScaling` | `PredictiveScaling` | `None`

**Default Value**

`TargetTracking`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.scalePolicyType": "StepScaling"
    }
  }
}
```

### aws.compute.ecs.pScale.maxCapacityBreachBehavior

Determine the behaviour that should be applied if the forecast capacity approaches or exceeds the maximum capacity.
This is used when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `PredictiveScaling`.

**Type**

string

**Deploy Targets**

`aws`

**Allowed Values**

`HonorMaxCapacity` | `IncreaseMaxCapacity`

**Default Value**

`HonorMaxCapacity`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.pScale.maxCapacityBreachBehavior": "IncreaseMaxCapacity"
    }
  }
}
```

### aws.compute.ecs.pScale.maxCapacityBuffer

Determine the size of the capacity buffer to use when the forecast capacity is close to or exceeds the maximum capacity. The value is specified as a percentage relative to the forecast capacity. For example, if the buffer is 10, this means a 10% buffer, such that if the forecast capacity os 50 and the maximum capacity is 40, then the effective maximum capacity will be 50 + 10% of 50 = 55.

This is used when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `PredictiveScaling`.
This is required if `aws.compute.ecs.pScale.maxCapacityBreachBehavior` is set to `IncreaseMaxCapacity` and will not be used otherwise.

**Type**

number

**Deploy Targets**

`aws`

**Minimum**

`0`

**Maximum**

`100`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.pScale.maxCapacityBuffer": 10
    }
  }
}
```

### aws.compute.ecs.pScale.mode

The predictive scaling mode to use when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `PredictiveScaling`.

**Type**

string

**Deploy Targets**

`aws`

**Allowed Values**

`ForecastOnly` | `ForecastAndScale`

**Default Value**

`ForecastOnly`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.pScale.mode": "ForecastAndScale"
    }
  }
}
```

### aws.compute.ecs.pScale.loadMetric

The type of metric to use as the load metric for predictive scaling.
This is used when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `PredictiveScaling`.

This is required for the `PredictiveScaling` scale policy type and will not be used otherwise.

**Type**

string

**Deploy Targets**

`aws`

**Allowed Values**

`ECSServiceAverageCPUUtilization` | `ECSServiceAverageMemoryUtilization` | `ECSServiceCPUUtilization` | `ECSServiceMemoryUtilization` | `ECSServiceTotalCPUUtilization` | `ECSServiceTotalMemoryUtilization` | `ALBRequestCount` | `ALBRequestCountPerTarget` | `TotalALBRequestCount`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.pScale.loadMetric": "ECSServiceAverageCPUUtilization"
    }
  }
}
```

### aws.compute.ecs.pScale.scalingMetric

The type of metric to use as the scaling metric for predictive scaling.
This is used when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `PredictiveScaling`.

This is required for the `PredictiveScaling` scale policy type and will not be used otherwise.

**Type**

string

**Deploy Targets**

`aws`

**Allowed Values**

`ECSServiceAverageCPUUtilization` | `ECSServiceAverageMemoryUtilization` | `ECSServiceCPUUtilization` | `ECSServiceMemoryUtilization` | `ECSServiceTotalCPUUtilization` | `ECSServiceTotalMemoryUtilization` | `ALBRequestCount` | `ALBRequestCountPerTarget` | `TotalALBRequestCount`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.pScale.scalingMetric": "ECSServiceAverageCPUUtilization"
    }
  }
}
```

### aws.compute.ecs.pScale.targetValue

Specifies the target utilisation for the scaling metric.
This is used when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `PredictiveScaling`.

This is required for the `PredictiveScaling` scale policy type and will not be used otherwise.

**Type**

number

**Deploy Targets**

`aws`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.pScale.targetValue": 50
    }
  }
}
```

### aws.compute.ecs.pScale.schedulingBuffertime

The amount of time, in seconds, that the start time can be advanced.
This value must be less than the forecast interval duration of 3600 seconds (60 minutes).
This is used when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `PredictiveScaling`.

**Type**

number

**Deploy Targets**

`aws`

**Default Value**

`300`

**Minimum**

`0`

**Maximum**

`3600`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.pScale.schedulingBuffertime": 500
    }
  }
}
```

### aws.compute.ecs.tScale.disableScaleIn

Indicates whether the scale in by the target tracking scaling policy is disabled.
If this is set to `true`, scale in is disabled and the target tracking scaling policy won't remove capacity from the scalable target.

This is used when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `TargetTracking`.

**Type**

boolean

**Deploy Targets**

`aws`

**Default Value**

`false`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.tScale.disableScaleIn": true
    }
  }
}
```

### aws.compute.ecs.tScale.scaleInCooldown

The amount of time, in seconds, after a scale-in activity completes before another scale-in activity can start. For defaults, see the [Define cooldown periods](https://docs.aws.amazon.com/autoscaling/application/userguide/target-tracking-scaling-policy-overview.html#target-tracking-cooldown) documentation.

This is used when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `TargetTracking`.

**Type**

number

**Deploy Targets**

`aws`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.tScale.scaleInCooldown": 120
    }
  }
}
```

### aws.compute.ecs.tScale.scaleOutCooldown

The amount of time, in seconds, to wait for a previous scale-out activity to take effect. For defaults, see the [Define cooldown periods](https://docs.aws.amazon.com/autoscaling/application/userguide/target-tracking-scaling-policy-overview.html#target-tracking-cooldown) documentation.

This is used when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `TargetTracking`.

**Type**

number

**Deploy Targets**

`aws`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.tScale.scaleOutCooldown": 120
    }
  }
}
```

### aws.compute.ecs.tScale.metric

The metric type to use for the target tracking scaling policy.

This is used when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `TargetTracking`.

**Type**

string

**Deploy Targets**

`aws`

**Allowed Values**

`ALBRequestCountPerTarget` | `ECSServiceAverageCPUUtilization` | `ECSServiceAverageMemoryUtilization`

**Default Value**

`ECSServiceAverageCPUUtilization`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.tScale.metric": "ALBRequestCountPerTarget"
    }
  }
}
```

### aws.compute.ecs.tScale.targetValue

The target value for the metric. This accepts floating point numbers but won't accept values that are either too small or too large. Values must be in the range of -2^360 to 2^360.
The value must be a valid number based on the choice of metric. For example, if the metric is CPU utlisation, then the target value is a percent value that represents how much of the CPU can be used before scaling out.

This is used when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `TargetTracking`.

**Type**

number

**Deploy Targets**

`aws`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.tScale.targetValue": 50
    }
  }
}
```

### aws.compute.ecs.sScale.adjustmentType

Specifies whether the `scalingAdjustment` values in the `stepAdjustments` array are absolute numbers or precentages of the current capacity.

This is used when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `StepScaling`.

**Type**

string

**Deploy Targets**

`aws`

**Allowed Values**

`ChangeInCapacity` | `ExactCapacity` | `PercentChangeInCapacity`

**Default Value**

`ChangeInCapacity`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.sScale.adjustmentType": "PercentChangeInCapacity"
    }
  }
}
```

### aws.compute.ecs.sScale.cooldown

The amount of time, in seconds, to wait for a previous scaling activity to take effect. For more information, see the [Define cooldown periods](https://docs.aws.amazon.com/autoscaling/application/userguide/step-scaling-policies.html#step-scaling-cooldown) documentation.

This is used when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `StepScaling`.

**Type**

number

**Deploy Targets**

`aws`

**Default Value**

`300`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.sScale.cooldown": 120
    }
  }
}
```

### aws.compute.ecs.sScale.metricAggregationType

The aggregation type to use for the CloudWatch metrics.

This is used when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `StepScaling`.

**Type**

string

**Deploy Targets**

`aws`

**Allowed Values**

`Average` | `Minimum` | `Maximum`

**Default Value**

`Average`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.sScale.metricAggregationType": "Maximum"
    }
  }
}
```

### aws.compute.ecs.sScale.minAdjustmentMagnitude

The minimum value to scale by when the adjustment type is `PercentChangeInCapacity`.
For exmaple, suppose you create a step scaling policy to scale out an Amazon ECS service by 25% and you specify a `minAdjustmentMagnitude` of 2. If the service has 4 tasks and the scaling policy is triggerred, 25 percent of 4 is 1. However, because you specified a `minAdjustmentMagnitude` of 2, the service scales out by 2 tasks instead of 1.

This is used when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `StepScaling`.

**Type**

number

**Deploy Targets**

`aws`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.sScale.minAdjustmentMagnitude": 2
    }
  }
}
```

### aws.compute.ecs.sScale.stepAdjustments.\<index\>.metricIntervalLowerBound

`aws.compute.ecs.sScale.stepAdjustments` is the namespace for a set of adjustments that enable you to scale based on the size of the alarm breach.
At least one step adjustment is required if you are adding a new step scaling policy configuration.

This is the lower bound for the difference between the alarm threshold and the CloudWatch metric.
If the metric value is above the breach threshold, the lower bound is inclusive (the metric must be greater than or equal to the threshold plus the lower bound).
Otherwise, it is exclusive (the metric must be greater than the threshold plus the lower bound).
An empty value means that there is no lower bound (negative infinity).

At least one upper or lower bound must be specified for each step adjustment.

This is used when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `StepScaling`.

**Type**

number

**Deploy Targets**

`aws`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.sScale.stepAdjustments.0.metricIntervalLowerBound": 0
    }
  }
}
```

### aws.compute.ecs.sScale.stepAdjustments.\<index\>.metricIntervalUpperBound

The upper bound for the difference between the alarm threshold and the CloudWatch metric.
If the metric value is above the breach threshold, the upper bound is exclusive (the metric must be less than the threshold plus the upper bound). Otherwise, it is inclusive (the metric must be less than or equal to the threshold plus the upper bound).
An empty value means that there is no upper bound (positive infinity).

At least one upper or lower bound must be specified for each step adjustment.

This is used when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `StepScaling`.

**Type**

number

**Deploy Targets**

`aws`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.sScale.stepAdjustments.0.metricIntervalUpperBound": 10
    }
  }
}
```

### aws.compute.ecs.sScale.stepAdjustments.\<index\>.scalingAdjustment

The amount by which to scale. The adjustment is based on the value that was specified in the ` aws.compute.ecs.sScale.adjustmentType` config entry (either an absolute number or a percentage). A positive value adds to the current capacity and a negative number subtracts from the current capacity.

This field is required for each step adjustment.

This is used when deploying to the `aws` target environment, the container service is `ecs` and the scale policy type is `StepScaling`.

**Type**

number

**Deploy Targets**

`aws`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.ecs.sScale.stepAdjustments.0.scalingAdjustment": 2
    }
  }
}
```

### aws.compute.eks.hpa.minReplicas

The minimum number of replicas of a pod that should be running at any time
for the Kubernetes horizontal pod autoscaler.
This is used when deploying to the `aws` target environment and the container service is `eks`.

**Type**

number

**Deploy Targets**

`aws`

**Default Value**

By default, this will be `1` for development app environments and `2` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.eks.hpa.minReplicas": 2
    }
  }
}
```

### aws.compute.eks.hpa.maxReplicas

The maximum number of replicas of a pod that should be running at any time
for the Kubernetes horizontal pod autoscaler.
This is used when deploying to the `aws` target environment and the container service is `eks`.

**Type**

number

**Deploy Targets**

`aws`

**Default Value**

By default, this will be `3` for development app environments and `6` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.eks.hpa.maxReplicas": 5
    }
  }
}
```

### aws.compute.eks.hpa.targetCPUUtilizationPercentage

The target CPU utilisation percentage for the Kubernetes horizontal pod autoscaler.
This will be used in forming the scaling policy for pods running the application.

If `aws.compute.eks.hpa.targetCPUAverageValue` is also set, this value will take precedence.

This is used when deploying to the `aws` target environment and the container service is `eks`.

**Type**

number

**Deploy Targets**

`aws`

**Default Value**

By default, this will be `50` (percent) for both development and production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.eks.hpa.targetCPUUtilizationPercentage": 45
    }
  }
}
```

### aws.compute.eks.hpa.targetCPUAverageValue

The target CPU **exact** average value for the Kubernetes horizontal pod autoscaler.
This will be used in forming the scaling policy for pods running the application.

If `aws.compute.eks.hpa.targetCPUUtilizationPercentage` is also set, this value will be ignored.

This is used when deploying to the `aws` target environment and the container service is `eks`.

**Type**

string

**Deploy Targets**

`aws`

**Default Value**

If not set, this will not be used, a utilisation percentage will be used instead.

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.eks.hpa.targetCPUAverageValue": "1000m"
    }
  }
}
```

### aws.compute.eks.hpa.targetMemoryUtilizationPercentage

The target memory utilisation percentage for the Kubernetes horizontal pod autoscaler.
This will be used in forming the scaling policy for pods running the application.
If `aws.compute.eks.hpa.targetMemoryAverageValue` is also set, this value will take precedence.

This is used when deploying to the `aws` target environment and the container service is `eks`.

**Type**

number

**Deploy Targets**

`aws`

**Default Value**

By default, this will be `70` (percent) for both development and production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.eks.hpa.targetMemoryUtilizationPercentage": 65
    }
  }
}
```

### aws.compute.eks.hpa.targetMemoryAverageValue

The target memory **exact** average value for the Kubernetes horizontal pod autoscaler.
This will be used in forming the scaling policy for pods running the application.
If `aws.compute.eks.hpa.targetMemoryUtilizationPercentage` is also set, this value will be ignored.

This is used when deploying to the `aws` target environment and the container service is `eks`.

**Type**

string

**Deploy Targets**

`aws`

**Default Value**

If not set, this will not be used, a utilisation percentage will be used instead.

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.eks.hpa.targetMemoryAverageValue": "2000Mi"
    }
  }
}
```

### aws.compute.eks.clusterAutoscaler.minNodes

The minimum number of nodes in the node group for your application running on EKS.
This is used when deploying to the `aws` target environment, the launch type is `ec2` and the container service is `eks`.

**Type**

number

**Deploy Targets**

`aws`

**Default Value**

By default, this will be `1` for development app environments and `2` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.eks.clusterAutoscaler.minNodes": 3
    }
  }
}
```

### aws.compute.eks.clusterAutoscaler.maxNodes

The maximum number of nodes in the node group for your application running on EKS.
This is used when deploying to the `aws` target environment, the launch type is `ec2` and the container service is `eks`.

**Type**

number

**Deploy Targets**

`aws`

**Default Value**

By default, this will be `3` for development app environments and `6` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.eks.clusterAutoscaler.maxNodes": 5
    }
  }
}
```

### aws.compute.eks.podMemory

The amount of memory that can be used by a single pod running the application.
This is used when deploying to the `aws` target environment and the container service is `eks`.

**Type**

string

**Deploy Targets**

`aws`

**Default Value**

If memory usage is set in the application blueprint for handlers in the application, these will be used to determine reasonable memory limits for pods instead.
If not set in the blueprint, by default, this will be `870Mi` for development app environments and `1792Mi` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.eks.podMemory": "2Gi"
    }
  }
}
```

### aws.compute.eks.podCPU

The amount of CPU that can be used by a single pod running the application.
This is used when deploying to the `aws` target environment and the container service is `eks`.

**Type**

string

**Deploy Targets**

`aws`

**Default Value**

If CPU usage is set in the application blueprint for handlers in the application, these will be used to determine reasonable CPU limits for pods instead.
If not set in the blueprint, by default, this will be `0.8` for both production and development app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.compute.eks.podCPU": "1"
    }
  }
}
```

### aws.compute.eks.apiserver

Details to connect to an existing Kubernetes cluster API server to deploy the application.
TODO: Add more details and config options for connecting to an existing cluster after testing out deployments of Celerity applications to existing clusters.

## Google Cloud Configuration Options

### gcloud.compute.containerService

Determine the container service to use when deploying to the `gcloud` target environment.

**Type**

string

**Deploy Targets**

`gcloud`

**Allowed Values**

`gke` | `cloudrun`

**Default Value**

`cloudrun`

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
      "gcloud.compute.containerService": "gke"
    }
  }
}
```

### gcloud.compute.cloudrun.instanceMemoryLimit

The maximum amount of memory that can be used by a single instance of the application
running on Cloud Run.
See [Cloud Run Limits](https://cloud.google.com/run/docs/configuring/services/cpu#setting) for more information on the combination of CPU and memory limits that can be set for Cloud Run.

**Type**

string

**Deploy Targets**

`gcloud`

**Default Value**

If memory usage is set in the application blueprint for handlers in the application, these will be used to determine reasonable memory limits for instances instead.
If not set in the blueprint, by default, this will be `1Gi` for development app environments and `2Gi` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
      "gcloud.compute.cloudrun.instanceMemoryLimit": "2Gi"
    }
  }
}
```

### gcloud.compute.cloudrun.instanceCPULimit

The maximum amount of CPU units that can be used by a single instance of the application
running on Cloud Run.
See [Cloud Run Limits](https://cloud.google.com/run/docs/configuring/services/cpu#setting) for more information on the combination of CPU and memory limits that can be set for Cloud Run.

**Type**

number

**Deploy Targets**

`gcloud`

**Default Value**

If CPU usage is set in the application blueprint for handlers in the application, these will be used to determine reasonable CPU limits for instances instead.
If not set in the blueprint, by default, this will be `0.5` for development app environments and `1` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
      "gcloud.compute.cloudrun.instanceCPULimit": 1
    }
  }
}
```

### gcloud.compute.cloudrun.autoscaling.minScale

The minimum number of instances to run for the Knative autoscaler that runs under the hood for Cloud Run. This is the [`autoscaling.knative.dev/minScale`](https://cloud.google.com/run/docs/reference/rest/v1/ObjectMeta) annotation.

**Type**

number

**Deploy Targets**

`gcloud`

**Default Value**

By default, this will be `1` for development app environments and `2` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
      "gcloud.compute.cloudrun.autoscaling.minScale": 2
    }
  }
}
```

### gcloud.compute.cloudrun.autoscaling.maxScale

The maximum number of instances to run for the Knative autoscaler that runs under the hood for Cloud Run. This is the [`autoscaling.knative.dev/maxScale`](https://cloud.google.com/run/docs/reference/rest/v1/ObjectMeta) annotation.

**Type**

number

**Deploy Targets**

`gcloud`

**Default Value**

By default, this will be `3` for development app environments and `5` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
      "gcloud.compute.cloudrun.autoscaling.maxScale": 5
    }
  }
}
```

### gcloud.compute.gke.mode

The mode to use when deploying to the `gcloud` target environment and the container service is `gke`.
This determines whether the application will be deployed in [standard or autopilot mode](https://cloud.google.com/kubernetes-engine/docs/resources/autopilot-standard-feature-comparison).

**Type**

string

**Deploy Targets**

`gcloud`

**Allowed Values**

`standard` | `autopilot`

**Default Value**

`standard`

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
      "gcloud.compute.gke.mode": "autopilot"
    }
  }
}
```

### gcloud.compute.gke.autoscaling.minNodesPerZone

The minimum number of nodes per zone to use when deploying to the `gcloud` target environment, the container service is `gke` and the mode is `standard`.

When deploying to a production app environment, there will be 2 zones used for the application, so this value will be multiplied by 2 to determine the minimum number of total nodes for the application.

When deploying to a development app environment, there will be 1 zone used for the application, so this value will be used as the minimum number of total nodes for the application.

**Type**

number

**Deploy Targets**

`gcloud`

**Default Value**

`1`

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
      "gcloud.compute.gke.autoscaling.minNodesPerZone": 2
    }
  }
}
```

### gcloud.compute.gke.autoscaling.maxNodesPerZone

The maximum number of nodes per zone to use when deploying to the `gcloud` target environment, the container service is `gke` and the mode is `standard`.

When deploying to a production app environment, there will be 2 zones used for the application, so this value will be multiplied by 2 to determine the maximum number of total nodes for the application.

When deploying to a development app environment, there will be 1 zone used for the application, so this value will be used as the maximum number of total nodes for the application.

**Type**

number

**Deploy Targets**

`gcloud`

**Default Value**

`3`

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
      "gcloud.compute.gke.autoscaling.maxNodesPerZone": 5
    }
  }
}
```

### gcloud.compute.gke.machineType

The machine type to use when deploying to the `gcloud` target environment, the container service is `gke` and the mode is `standard`.

**Type**

string

**Deploy Targets**

`gcloud`

**Default Value**

If not set and the machine type can not be derived from the application handlers, the default machine type will be `n2-highcpu-2` for development app environments and `n2-highcpu-4` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
      "gcloud.compute.gke.machineType": "n4-standard-4"
    }
  }
}
```

### gcloud.compute.gke.podMemory

The amount of memory that can be used by a single pod running the application.
This is used when deploying to the `gcloud` target environment and the container service is `gke`.

**Type**

string

**Deploy Targets**

`gcloud`

**Default Value**

If memory usage is set in the application blueprint for handlers in the application, these will be used to determine reasonable memory limits for pods instead.
If not set in the blueprint, by default, this will be `870Mi` for development app environments and `1792Mi` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
      "gcloud.compute.gke.podMemory": "2Gi"
    }
  }
}
```

### gcloud.compute.gke.podCPU

The amount of CPU that can be used by a single pod running the application.
This is used when deploying to the `gcloud` target environment and the container service is `gke`.

**Type**

string

**Deploy Targets**

`gcloud`

**Default Value**

If CPU usage is set in the application blueprint for handlers in the application, these will be used to determine reasonable CPU limits for pods instead.
If not set in the blueprint, by default, this will be `0.8` for development app environments and `1.6` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
      "gcloud.compute.gke.podCPU": "1"
    }
  }
}
```

### gcloud.compute.gke.hpa.minReplicas

The minimum number of replicas of a pod that should be running at any time for the Kubernetes horizontal pod autoscaler. This is used when deploying to the `gcloud` target environment and the container service is `gke`.

**Type**

number

**Deploy Targets**

`gcloud`

**Default Value**

By default, this will be `1` for development app environments and `2` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
      "gcloud.compute.gke.hpa.minReplicas": 2
    }
  }
}
```

### gcloud.compute.gke.hpa.maxReplicas

The maximum number of replicas of a pod that should be running at any time for the Kubernetes horizontal pod autoscaler. This is used when deploying to the `gcloud` target environment and the container service is `gke`.

**Type**

number

**Deploy Targets**

`gcloud`

**Default Value**

By default, this will be `3` for development app environments and `6` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
      "gcloud.compute.gke.hpa.maxReplicas": 5
    }
  }
}
```

### gcloud.compute.gke.hpa.targetCPUUtilizationPercentage

The target CPU utilisation percentage for the Kubernetes horizontal pod autoscaler. This will be used in forming the scaling policy for pods running the application.

If `gcloud.compute.gke.hpa.targetCPUAverageValue` is also set, this value will take precedence.

This is used when deploying to the `gcloud` target environment and the container service is `gke`.

**Type**

number

**Deploy Targets**

`gcloud`

**Default Value**

By default, this will be `50` (percent) for both development and production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
      "gcloud.compute.gke.hpa.targetCPUUtilizationPercentage": 45
    }
  }
}
```

### gcloud.compute.gke.hpa.targetCPUAverageValue

The target CPU **exact** average value for the Kubernetes horizontal pod autoscaler. This will be used in forming the scaling policy for pods running the application.

If `gcloud.compute.gke.hpa.targetCPUUtilizationPercentage` is also set, this value will be ignored.

This is used when deploying to the `gcloud` target environment and the container service is `gke`.

**Type**

string

**Deploy Targets**

`gcloud`

**Default Value**

If not set, this will not be used, a utilisation percentage will be used instead.

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
      "gcloud.compute.gke.hpa.targetCPUAverageValue": "1000m"
    }
  }
}
```

### gcloud.compute.gke.hpa.targetMemoryUtilizationPercentage

The target memory utilisation percentage for the Kubernetes horizontal pod autoscaler. This will be used in forming the scaling policy for pods running the application.

If `gcloud.compute.gke.hpa.targetMemoryAverageValue` is also set, this value will take precedence.

This is used when deploying to the `gcloud` target environment and the container service is `gke`.

**Type**

number

**Deploy Targets**

`gcloud`

**Default Value**

By default, this will be `70` (percent) for both development and production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
      "gcloud.compute.gke.hpa.targetMemoryUtilizationPercentage": 65
    }
  }
}
```

### gcloud.compute.gke.hpa.targetMemoryAverageValue

The target memory **exact** average value for the Kubernetes horizontal pod autoscaler. This will be used in forming the scaling policy for pods running the application.

If `gcloud.compute.gke.hpa.targetMemoryUtilizationPercentage` is also set, this value will be ignored.

This is used when deploying to the `gcloud` target environment and the container service is `gke`.

**Type**

string

**Deploy Targets**

`gcloud`

**Default Value**

If not set, this will not be used, a utilisation percentage will be used instead.

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
      "gcloud.compute.gke.hpa.targetMemoryAverageValue": "2000Mi"
    }
  }
}
```

### gcloud.compute.gke.apiserver

Details to connect to an existing Kubernetes cluster API server to deploy the application.
TODO: Add more details and config options for connecting to an existing cluster after testing out deployments of Celerity applications to existing clusters.

## Azure Configuration Options

### azure.compute.containerService

Determine the container service to use when deploying to the `azure` target environment.

**Type**

string

**Deploy Targets**

`azure`

**Allowed Values**

`containerApps` | `aks`

**Default Value**

`containerApps`

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.containerService": "aks"
    }
  }
}
```

### azure.compute.containerApps.minReplicas

The minimum number of replicas per revision to use when deploying to the `azure` target environment and the container service is `containerApps`.

This only applies to Celerity applications that represent an service that is expected to be reached via HTTP requests (i.e. `celerity/api` and `celerity/workflow` applications).

**Type**

number

**Deploy Targets**

`azure`

**Default Value**

By default, this will be `1` for development app environments and `2` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.containerApps.minReplicas": 2
    }
  }
}
```

### azure.compute.containerApps.maxReplicas

The maximum number of replicas per revision to use when deploying to the `azure` target environment and the container service is `containerApps`.

This only applies to Celerity applications that represent an service that is expected to be reached via HTTP requests (i.e. `celerity/api` and `celerity/workflow` applications).

**Type**

number

**Deploy Targets**

`azure`

**Default Value**

By default, this will be `3` for development app environments and `5` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.containerApps.maxReplicas": 5
    }
  }
}
```

### azure.compute.containerApps.cpu

The maximum amount of vCPU cores that can be used by a single instance of the application
running on Container Apps.
See [Container Apps allocations](https://learn.microsoft.com/en-us/azure/container-apps/containers#allocations) for more information on the combination of CPU and memory allocations that can be set for Container Apps using the Consumption plan.

**Type**

number

**Deploy Targets**

`azure`

**Default Value**

If CPU usage is set in the application blueprint for handlers in the application, these will be used to determine reasonable CPU limits for instances instead.
If not set in the blueprint, by default, this will be `0.5` for development app environments and `1` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.containerApps.cpu": 1
    }
  }
}
```

### azure.compute.containerApps.memory

The maximum amount of memory that can be used by a single instance of the application
running on Container Apps.
See [Container Apps allocations](https://learn.microsoft.com/en-us/azure/container-apps/containers#allocations) for more information on the combination of CPU and memory allocations that can be set for Container Apps using the Consumption plan.

**Type**

string

**Deploy Targets**

`azure`

**Default Value**

If memory usage is set in the application blueprint for handlers in the application, these will be used to determine reasonable memory limits for instances instead.
If not set in the blueprint, by default, this will be `1Gi` for development app environments and `2Gi` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.containerApps.memory": "2Gi"
    }
  }
}
```

### azure.compute.aks.systemPoolInstanceType

The instance type to use for the system components running on the AKS cluster.
This is used when deploying to the `azure` target environment and the container service is `aks`.

**Type**

string

**Deploy Targets**

`azure`

**Default Value**

By default, this will be `Standard_D4d_v5` for both production and development app environments.
See the [minimum requirements for system Node Pools](https://learn.microsoft.com/en-us/azure/aks/use-system-pools?tabs=azure-cli#system-and-user-node-pools) when choosing a custom instance type to use for the system components of your cluster.

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.aks.systemPoolInstanceType": "Standard_D4d_v5"
    }
  }
}
```

### azure.compute.aks.appPoolInstanceType

The instance type to use for the application node pools running on the AKS cluster.
This is used when deploying to the `azure` target environment and the container service is `aks`.

**Type**

string

**Deploy Targets**

`azure`

**Default Value**

By default, this will be `Standard_D4ls_v6` for production app environments and `Standard_D2ls_v6` for development app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.aks.appPoolInstanceType": "Standard_D4d_v5"
    }
  }
}
```

### azure.compute.aks.systemPoolMinNodes

The minimum number of nodes in the system node pool for the AKS cluster.
This is used when deploying to the `azure` target environment and the container service is `aks`.

**Type**

number

**Deploy Targets**

`azure`

**Default Value**

By default, this will be `1` for development app environments and `2` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.aks.systemPoolMinNodes": 2
    }
  }
}
```

### azure.compute.aks.systemPoolMaxNodes

The maximum number of nodes in the system node pool for the AKS cluster.
This is used when deploying to the `azure` target environment and the container service is `aks`.

**Type**

number

**Deploy Targets**

`azure`

**Default Value**

By default, this will be `2` for development app environments and `3` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.aks.systemPoolMaxNodes": 3
    }
  }
}
```

### azure.compute.aks.appPoolMinNodes

The minimum number of nodes in the application node pool for the AKS cluster.
This is used when deploying to the `azure` target environment and the container service is `aks`.

**Type**

number

**Deploy Targets**

`azure`

**Default Value**

By default, this will be `1` for development app environments and `3` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.aks.appPoolMinNodes": 3
    }
  }
}
```

### azure.compute.aks.appPoolMaxNodes

The maximum number of nodes in the application node pool for the AKS cluster.
This is used when deploying to the `azure` target environment and the container service is `aks`.

**Type**

number

**Deploy Targets**

`azure`

**Default Value**

By default, this will be `3` for development app environments and `6` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.aks.appPoolMaxNodes": 5
    }
  }
}
```

### azure.compute.aks.podMemory

The amount of memory that can be used by a single pod running the application.
This is used when deploying to the `azure` target environment and the container service is `aks`.

**Type**

string

**Deploy Targets**

`azure`

**Default Value**

If memory usage is set in the application blueprint for handlers in the application, these will be used to determine reasonable memory limits for pods instead.
If not set in the blueprint, by default, this will be `870Mi` for development app environments and `1792Mi` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.aks.podMemory": "2Gi"
    }
  }
}
```

### azure.compute.aks.podCPU

The amount of CPU that can be used by a single pod running the application.
This is used when deploying to the `azure` target environment and the container service is `aks`.

**Type**

string

**Deploy Targets**

`azure`

**Default Value**

If CPU usage is set in the application blueprint for handlers in the application, these will be used to determine reasonable CPU limits for pods instead.
If not set in the blueprint, by default, this will be `0.4` for development app environments and `0.8` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.aks.podCPU": "1"
    }
  }
}
```

### azure.compute.aks.hpa.minReplicas

The minimum number of replicas of a pod that should be running at any time for the Kubernetes horizontal pod autoscaler. This is used when deploying to the `azure` target environment and the container service is `aks`.

**Type**

number

**Deploy Targets**

`azure`

**Default Value**

By default, this will be `1` for development app environments and `2` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.aks.hpa.minReplicas": 2
    }
  }
}
```

### azure.compute.aks.hpa.maxReplicas

The maximum number of replicas of a pod that should be running at any time for the Kubernetes horizontal pod autoscaler. This is used when deploying to the `azure` target environment and the container service is `aks`.

**Type**

number

**Deploy Targets**

`azure`

**Default Value**

By default, this will be `6` for development app environments and `12` for production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.aks.hpa.maxReplicas": 10
    }
  }
}
```

### azure.compute.aks.hpa.targetCPUUtilizationPercentage

The target CPU utilisation percentage for the Kubernetes horizontal pod autoscaler. This will be used in forming the scaling policy for pods running the application.

If `azure.compute.aks.hpa.targetCPUAverageValue` is also set, this value will take precedence.

This is used when deploying to the `azure` target environment and the container service is `aks`.

**Type**

number

**Deploy Targets**

`azure`

**Default Value**

By default, this will be `50` (percent) for both development and production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.aks.hpa.targetCPUUtilizationPercentage": 45
    }
  }
}
```

### azure.compute.aks.hpa.targetCPUAverageValue

The target CPU **exact** average value for the Kubernetes horizontal pod autoscaler. This will be used in forming the scaling policy for pods running the application.

If `azure.compute.aks.hpa.targetCPUUtilizationPercentage` is also set, this value will be ignored.

This is used when deploying to the `azure` target environment and the container service is `aks`.

**Type**

string

**Deploy Targets**

`azure`

**Default Value**

If not set, this will not be used, a utilisation percentage will be used instead.

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.aks.hpa.targetCPUAverageValue": "1000m"
    }
  }
}
```

### azure.compute.aks.hpa.targetMemoryUtilizationPercentage

The target memory utilisation percentage for the Kubernetes horizontal pod autoscaler. This will be used in forming the scaling policy for pods running the application.

If `azure.compute.aks.hpa.targetMemoryAverageValue` is also set, this value will take precedence.

This is used when deploying to the `azure` target environment and the container service is `aks`.

**Type**

number

**Deploy Targets**

`azure`

**Default Value**

By default, this will be `70` (percent) for both development and production app environments.

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.aks.hpa.targetMemoryUtilizationPercentage": 65
    }
  }
}
```

### azure.compute.aks.hpa.targetMemoryAverageValue

The target memory **exact** average value for the Kubernetes horizontal pod autoscaler. This will be used in forming the scaling policy for pods running the application.

If `azure.compute.aks.hpa.targetMemoryUtilizationPercentage` is also set, this value will be ignored.

This is used when deploying to the `azure` target environment and the container service is `aks`.

**Type**

string

**Deploy Targets**

`azure`

**Default Value**

If not set, this will not be used, a utilisation percentage will be used instead.

**Example**

```javascript
{
  "deployTarget": {
    "name": "azure",
    "appEnv": "production",
    "config": {
      "azure.compute.aks.hpa.targetMemoryAverageValue": "2000Mi"
    }
  }
}
```

### azure.compute.aks.apiserver

Details to connect to an existing Kubernetes cluster API server to deploy the application.
TODO: Add more details and config options for connecting to an existing cluster after testing out deployments of Celerity applications to existing clusters.
