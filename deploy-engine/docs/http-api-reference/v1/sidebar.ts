import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "docs/http-api-reference/v1/deploy-engine-api",
    },
    {
      type: "category",
      label: "Validation",
      items: [
        {
          type: "doc",
          id: "docs/http-api-reference/v1/create-blueprint-validation",
          label: "Create a Blueprint Validation",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/get-blueprint-validation",
          label: "Retrieve a Blueprint Validation",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/stream-blueprint-validation-events",
          label: "Stream Blueprint Validation Events",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/clean-up-blueprint-validations",
          label: "Clean up Blueprint Validations",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Deployments",
      items: [
        {
          type: "doc",
          id: "docs/http-api-reference/v1/create-change-set",
          label: "Create a Change Set (Stage Changes)",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/get-change-set",
          label: "Get a Change Set",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/stream-change-staging-events",
          label: "Stream Change Staging Events",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/clean-up-change-sets",
          label: "Clean up Change Sets",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/create-blueprint-instance",
          label: "Create a Blueprint Instance (Deploy New)",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/update-blueprint-instance",
          label: "Update a Blueprint Instance (Deploy Existing)",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/get-blueprint-instance",
          label: "Get a Blueprint Instance",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/get-blueprint-instance-exports",
          label: "Get Blueprint Instance Exports",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/destroy-blueprint-instance",
          label: "Destroy a Blueprint Instance",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/stream-deployment-events",
          label: "Stream Deployment Events",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Events",
      items: [
        {
          type: "doc",
          id: "docs/http-api-reference/v1/clean-up-events",
          label: "Clean up Events",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Schemas",
      items: [
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/blueprintvalidationpayload",
          label: "BlueprintValidationPayload",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/blueprintvalidation",
          label: "BlueprintValidation",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/blueprintvalidationevent",
          label: "BlueprintValidationEvent",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/changestagingevent",
          label: "ChangeStagingEvent",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/resourcechangesevent",
          label: "ResourceChangesEvent",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/childchangesevent",
          label: "ChildChangesEvent",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/linkchangesevent",
          label: "LinkChangesEvent",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/changestagingcompleteevent",
          label: "ChangeStagingCompleteEvent",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/errorevent",
          label: "ErrorEvent",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/deploymentevent",
          label: "DeploymentEvent",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/resourcedeploymentevent",
          label: "ResourceDeploymentEvent",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/childdeploymentevent",
          label: "ChildDeploymentEvent",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/linkdeploymentevent",
          label: "LinkDeploymentEvent",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/instanceupdatedeploymentevent",
          label: "InstanceUpdateDeploymentEvent",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/finishdeploymentevent",
          label: "FinishDeploymentEvent",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/diagnostic",
          label: "Diagnostic",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/diagnosticrange",
          label: "DiagnosticRange",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/sourcemeta",
          label: "SourceMeta",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/sourceposition",
          label: "SourcePosition",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/createchangesetpayload",
          label: "CreateChangeSetPayload",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/createblueprintinstancepayload",
          label: "CreateBlueprintInstancePayload",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/updateblueprintinstancepayload",
          label: "UpdateBlueprintInstancePayload",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/destroyblueprintinstancepayload",
          label: "DestroyBlueprintInstancePayload",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/changeset",
          label: "ChangeSet",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/changesetchanges",
          label: "ChangeSetChanges",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/blueprintmetadatachanges",
          label: "BlueprintMetadataChanges",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/fieldchange",
          label: "FieldChange",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/resourcechanges",
          label: "ResourceChanges",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/linkchanges",
          label: "LinkChanges",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/resourceinfo",
          label: "ResourceInfo",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/resourcestate",
          label: "ResourceState",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/resourcemetadatastate",
          label: "ResourceMetadataState",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/resourcecompletiondurations",
          label: "ResourceCompletionDurations",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/resolvedresource",
          label: "ResolvedResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/linkselector",
          label: "LinkSelector",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/resolvedresourcecondition",
          label: "ResolvedResourceCondition",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/newblueprintdefinition",
          label: "NewBlueprintDefinition",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/blueprintinstance",
          label: "BlueprintInstance",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/blueprintinstanceexports",
          label: "BlueprintInstanceExports",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/exportstate",
          label: "ExportState",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/dependencyinfo",
          label: "DependencyInfo",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/blueprintinstancecompletiondurations",
          label: "BlueprintInstanceCompletionDurations",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/linkstate",
          label: "LinkState",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/linkintermediaryresourcestate",
          label: "LinkIntermediaryResourceState",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/linkcompletiondurations",
          label: "LinkCompletionDurations",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/linkcomponentcompletiondurations",
          label: "LinkComponentCompletionDurations",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/unexpectederror",
          label: "UnexpectedError",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/unauthorisederror",
          label: "UnauthorisedError",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/badrequesterror",
          label: "BadRequestError",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/unprocessableentityerror",
          label: "UnprocessableEntityError",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/notfounderror",
          label: "NotFoundError",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/cleanupstartedresponse",
          label: "CleanupStartedResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/blueprintlocationmetadata",
          label: "BlueprintLocationMetadata",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/config",
          label: "Config",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/anyvalue",
          label: "AnyValue",
          className: "schema",
        },
        {
          type: "doc",
          id: "docs/http-api-reference/v1/schemas/scalarvalue",
          label: "ScalarValue",
          className: "schema",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
