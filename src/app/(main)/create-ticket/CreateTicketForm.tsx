"use client";
import LoadingButton from "@/components/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { fetchCollection } from "@/lib/fetchCollection";
import { EmployeesProps, TicketStatusTypes } from "@/lib/types";
import { capitalizeSentences, cn } from "@/lib/utils";
import { CreateTicketFormValue, createTicketSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import LoginModal from "../LoginModal";
import { createTicket } from "./createTicket";

export default function CreateTicketForm() {
  const [isSubmitPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      Day: "",
      Month: "",
      Year: "",
      ActionTime: "",
      Address: "",
      Apartment: "",
      Description: "",
      CustomerName: "",
      Phone: "",
      SC: "",
      Technician: "",
      TicketNumber: "",
    },
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: employees,
    isPending,
    isError,
  } = useQuery<EmployeesProps[]>({
    queryKey: ["employees"],
    queryFn: () => fetchCollection<EmployeesProps>("employees"),
    retry: 1,
    staleTime: Infinity,
  });
  const inputDesign = "rounded-xl h-12 border border-[#0d2841] bg-white";
  const labelDesign = "text-lg text-[#0d2841]";

  async function onSubmit(formValues: CreateTicketFormValue) {
    startTransition(async () => {
      const validation = createTicketSchema.safeParse(formValues);

      if (!validation.success) {
        toast.error("Validation failed. Please check your inputs.");
        return;
      }

      const values = validation.data;

      const {
        Day,
        Month,
        Year,
        ActionTime,
        Address,
        Apartment,
        CustomerName,
        Phone,
        Description,
        SC,
        Technician,
        TicketNumber,
      } = values;

      const year = Number(Year);
      const month = Number(Month) - 1;
      const day = Number(Day);
      const jsDate = new Date(year, month, day);

      const firebaseData = {
        ActionDate: Timestamp.fromDate(jsDate),
        ActionTime,
        Address: capitalizeSentences(Address),
        Apartment,
        CustomerName,
        Phone,
        Description,
        SC: Number(SC),
        Technician,
        TicketNumber: TicketNumber.toUpperCase(),
        Done: false,
        TicketStatus: "Open" as TicketStatusTypes,
      };
      try {
        const { success, message } = await createTicket(firebaseData);
        if (success) {
          toast.success(message);
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
          router.push("/tickets");
        }
      } catch (error) {
        console.error("Create ticket failed: ", error);
        toast.error((error as Error).message || "Unknown error occurred");
      }
    });
  }

  return (
    <LoginModal>
      <div className="h-full w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 px-4 py-2 max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-1  gap-4 md:grid-cols-3">
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="Day"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col gap-2 justify-start">
                        <FormLabel className={labelDesign}>Day</FormLabel>
                        <FormControl>
                          <Input
                            className={`${inputDesign}`}
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Month"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col gap-2 justify-start">
                        <FormLabel className={labelDesign}>Month</FormLabel>
                        <FormControl>
                          <Input
                            className={inputDesign}
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Year"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col gap-2 justify-start">
                        <FormLabel className={labelDesign}>Year</FormLabel>
                        <FormControl>
                          <Input
                            className={inputDesign}
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="Technician"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2 justify-start">
                      <FormLabel className={labelDesign}>Technician</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl h-12 border border-[#0d2841] bg-white w-full">
                            <SelectValue
                              className="h-12"
                              placeholder="Technician"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border border-[#0d2841] bg-white text-[#0d2841] rounded-xl">
                          {isPending && (
                            <>
                              <div className="px-4 py-2">
                                <Skeleton className="h-10 bg-gray-300 rounded-xl w-full mb-1" />
                              </div>
                            </>
                          )}

                          {isError && (
                            <SelectItem
                              className="text-destructive cursor-not-allowed"
                              disabled
                              value="error"
                            >
                              Cannot connect to server
                            </SelectItem>
                          )}
                          {!isPending &&
                            !isError &&
                            employees?.map((emp) => (
                              <SelectItem
                                key={emp.id}
                                className="h-12 text-[#0d2841] capitalize"
                                value={emp.name}
                              >
                                {emp.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="SC"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2 justify-start">
                      <FormLabel className={labelDesign}>SC</FormLabel>
                      <FormControl>
                        <Input
                          className={`${inputDesign}`}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-3 grid-cols-1  gap-4">
              <FormField
                control={form.control}
                name="ActionTime"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2 justify-start">
                      <FormLabel className={labelDesign}>Time</FormLabel>
                      <FormControl>
                        <Input
                          className={`${inputDesign}`}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="TicketNumber"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2 justify-start">
                      <FormLabel className={labelDesign}>
                        Ticket Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={`${inputDesign}`}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="CustomerName"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2 justify-start">
                      <FormLabel className={labelDesign}>
                        Customer Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={`${inputDesign}`}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-3 grid-cols-1  gap-4">
              <FormField
                control={form.control}
                name="Address"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2 justify-start">
                      <FormLabel className={labelDesign}>Address</FormLabel>
                      <FormControl>
                        <Input
                          className={`${inputDesign}`}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Phone"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2 justify-start">
                      <FormLabel className={labelDesign}>
                        Customer Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={`${inputDesign}`}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Apartment"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2 justify-start">
                      <FormLabel className={labelDesign}>Unit</FormLabel>
                      <FormControl>
                        <Input
                          className={`${inputDesign}`}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1  gap-4">
              <FormField
                control={form.control}
                name="Description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2 justify-start">
                      <FormLabel className={labelDesign}>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className={cn(inputDesign, "h-28")}
                          placeholder="Write your problem here"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <LoadingButton
              loading={isSubmitPending}
              variant={"companyBtn"}
              type="submit"
              className="h-12 w-full text-xl my-4 rounded-xl"
            >
              Create
            </LoadingButton>
          </form>
        </Form>
      </div>
    </LoginModal>
  );
}
