import { useRouter } from "next/navigation";
import { useAppState } from "@/components/providers/AppStateProvider";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";

const NotionCreateWorkspace = () => {
  const router = useRouter();
  const { dispatch } = useAppState();
  const [selectedEmoji, setSelectedEmoji] = useState("💼");
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting: isLoading, errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      logo: "",
      workspaceName: "",
    },
  });

  const onSubmit = async (value: any) => {
    const file = value.logo?.[0];
    let filePath = null;
    const workspaceUUID = v4();
    console.log(file);

    if (file) {
      try {
        const { data, error } = await supabase.storage
          .from("workspace-logos")
          .upload(`workspaceLogo.${workspaceUUID}`, file, {
            cacheControl: "3600",
            upsert: true,
          });
        if (error) throw new Error("");
        filePath = data.path;
      } catch (error) {
        console.log("Error", error);
        toast({
          variant: "destructive",
          title: "Error! Could not upload your workspace logo",
        });
      }
    }
    try {
      const newWorkspace: workspace = {
        data: null,
        createdAt: new Date().toISOString(),
        iconId: selectedEmoji,
        id: workspaceUUID,
        inTrash: "",
        title: value.workspaceName,
        workspaceOwner: user.id,
        logo: filePath || null,
        bannerUrl: "",
      };
      const { data, error: createError } = await createWorkspace(newWorkspace);
      if (createError) {
        throw new Error();
      }
      dispatch({
        type: "ADD_WORKSPACE",
        payload: { ...newWorkspace, folders: [] },
      });

      toast({
        title: "Workspace Created",
        description: `${newWorkspace.title} has been created successfully.`,
      });

      router.replace(`/dashboard/${newWorkspace.id}`);
    } catch (error) {
      console.log(error, "Error");
      toast({
        variant: "destructive",
        title: "Could not create your workspace",
        description:
          "Oops! Something went wrong, and we couldn't create your workspace. Try again or come back later.",
      });
    } finally {
      reset();
    }
  };

  return (
    <Card
      className="h-screen
      w-[800px]
      sm:h-auto
  "
    >
      <CardHeader>
        <CardTitle>Create A Workspace</CardTitle>
        <CardDescription>
          Lets create a private workspace to get you started.You can add
          collaborators later from the workspace settings tab.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div
              className="flex
            items-center
            gap-4"
            >
              <div className="text-5xl">
                <EmojiPicker getValue={(emoji) => setSelectedEmoji(emoji)}>
                  {selectedEmoji}
                </EmojiPicker>
              </div>
              <div className="w-full ">
                <Label
                  htmlFor="workspaceName"
                  className="text-sm
                  text-muted-foreground
                "
                >
                  Name
                </Label>
                <Input
                  id="workspaceName"
                  type="text"
                  placeholder="Workspace Name"
                  disabled={isLoading}
                  {...register("workspaceName", {
                    required: "Workspace name is required",
                  })}
                />
                <small className="text-red-600">
                  {errors?.workspaceName?.message?.toString()}
                </small>
              </div>
            </div>
            <div>
              <Label
                htmlFor="logo"
                className="text-sm
                  text-muted-foreground
                "
              >
                Workspace Logo
              </Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                placeholder="Workspace Name"
                // disabled={isLoading || subscription?.status !== 'active'}
                {...register("logo", {
                  required: false,
                })}
              />
              <small className="text-red-600">
                {errors?.logo?.message?.toString()}
              </small>
              {subscription?.status !== "active" && (
                <small
                  className="
                  block
                  text-muted-foreground
              "
                >
                  To customize your workspace, you need to be on a Pro Plan
                </small>
              )}
            </div>
            <div className="self-end">
              <Button disabled={isLoading} type="submit">
                {!isLoading ? "Create Workspace" : <Loader />}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DashboardSetup;
