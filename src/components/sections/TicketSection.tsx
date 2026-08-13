"use client";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/ui/Reveal";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { useKKiaPay } from "kkiapay-react";
import { Config } from "@/config";
import { createOrderAction } from "@/app/actions/orders";

const TICKET_KEY = "standard" as const;

const ticketSchema = z.object({
  name: z.string().min(2, "Le nom est requis (min. 2 caractères)"),
  email: z.string().email("Adresse email invalide"),
});

type FormErrors = Partial<Record<"name" | "email" | "phone" | "api", string>>;
type Step = "form" | "success" | "error";

export function TicketSection() {
  const { t } = useLanguage();
  const { openKkiapayWidget, addKkiapayListener, removeKkiapayListener, addKkiapayCloseListener } =
    useKKiaPay();

  const [step, setStep] = useState<Step>("form");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const paymentSettledRef = useRef(false);

  useEffect(() => {
    const onSuccess = () => {
      paymentSettledRef.current = true;
      setIsLoading(false);
      setStep("success");
    };

    const onFailed = () => {
      paymentSettledRef.current = true;
      setIsLoading(false);
      setStep("error");
    };

    const onWidgetClose = () => {
      if (paymentSettledRef.current) return;
      setIsLoading(false);
    };

    addKkiapayListener("success", onSuccess);
    addKkiapayListener("failed", onFailed);
    addKkiapayCloseListener(onWidgetClose);

    return () => {
      removeKkiapayListener("success");
      removeKkiapayListener("failed");
    };
  }, [addKkiapayListener, removeKkiapayListener, addKkiapayCloseListener]);

  const isBusy = isSubmittingOrder || isLoading;

  const buttonLabel = isSubmittingOrder
    ? "Création de la commande…"
    : isLoading
    ? "Ouverture du paiement…"
    : t.tickets.button;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const raw = {
      name: (fd.get("name") as string) ?? "",
      email: (fd.get("email") as string) ?? "",
    };

    const result = ticketSchema.safeParse(raw);
    const fieldErrors: FormErrors = {};

    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
    }

    if (!phone || !isValidPhoneNumber(phone)) {
      fieldErrors.phone = "Numéro de téléphone invalide";
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    const apiKey = Config.PAYMENT_KEY ?? "";
    if (!apiKey.trim()) {
      setErrors({ api: "Clé de paiement manquante." });
      return;
    }

    setErrors({});
    paymentSettledRef.current = false;
    setIsSubmittingOrder(true);

    const { name, email } = result.data!;
    const [firstName, ...rest] = name.trim().split(" ");
    const lastName = rest.join(" ") || firstName;
    const phoneDigits = phone.replace(/\D/g, "");

    try {
      const orderResult = await createOrderAction({
        client: { firstName, lastName, email, phone },
        order: { ticketId: TICKET_KEY, quantity: 1 },
        payment: { currency: "XOF", provider: "kkiapay" },
      });

      if (!orderResult.ok) {
        setErrors({ api: orderResult.message ?? "Une erreur est survenue. Veuillez réessayer." });
        return;
      }

      const { transactionId, amount } = orderResult;
      setIsLoading(true);

      openKkiapayWidget({
        amount,
        api_key: apiKey,
        sandbox: Config.IS_SANDBOX,
        email,
        phone: phoneDigits,
        data: transactionId,
        fullname: name.trim(),
      });
    } catch {
      setErrors({ api: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <section className="tickets" id="tickets">
      <Reveal>
        <div className="ticket-card">
          <div className="ticket-copy">
            <p className="section-kicker">{t.tickets.kicker}</p>
            <h2>{t.tickets.title}</h2>
            <strong className="ticket-price">{t.tickets.price}</strong>
            <p>{t.tickets.includes}</p>
            <small>{t.tickets.rule}</small>
          </div>
          <form onSubmit={submit} noValidate>
            {step === "success" ? (
              <div className="payment-confirmed" role="status">
                <p className="payment-confirmed__heading">Paiement<br />confirmé !</p>
                <div className="payment-confirmed__details">
                  <div className="payment-confirmed__row">
                    <span className="payment-confirmed__label">Date</span>
                    <span>Jeudi 20 août, dès 20h</span>
                  </div>
                  <div className="payment-confirmed__row">
                    <span className="payment-confirmed__label">Lieu</span>
                    <span>Gallery Loft Lab, Sainte Rita, Cotonou</span>
                  </div>
                  <div className="payment-confirmed__row">
                    <span className="payment-confirmed__label">Dress code</span>
                    <span>Made in Bénin</span>
                  </div>
                  <div className="payment-confirmed__row">
                    <span className="payment-confirmed__label">Inclus</span>
                    <span>1 cocktail offert</span>
                  </div>
                  <div className="payment-confirmed__row">
                    <span className="payment-confirmed__label">Entrée</span>
                    <span>QR code — 1 entrée par billet</span>
                  </div>
                </div>
                <p className="payment-confirmed__note">
                  Ton billet et les instructions d'accès t'ont été envoyés par e-mail. Billet non remboursable.
                </p>
              </div>
            ) : step === "error" ? (
              <>
                <p className="form-error" role="alert" style={{ fontSize: "0.9rem" }}>
                  Le paiement a échoué. Veuillez réessayer.
                </p>
                <button
                  type="button"
                  className="button primary"
                  onClick={() => {
                    paymentSettledRef.current = false;
                    setStep("form");
                  }}
                >
                  Réessayer
                </button>
              </>
            ) : (
              <>
                <label>
                  {t.tickets.name}
                  <input
                    name="name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    disabled={isBusy}
                  />
                  {errors.name && (
                    <span className="form-error" role="alert">{errors.name}</span>
                  )}
                </label>
                <label>
                  {t.tickets.phone}
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    invalid={!!errors.phone}
                    disabled={isBusy}
                  />
                  {errors.phone && (
                    <span className="form-error" role="alert">{errors.phone}</span>
                  )}
                </label>
                <label>
                  {t.tickets.email}
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    disabled={isBusy}
                  />
                  {errors.email && (
                    <span className="form-error" role="alert">{errors.email}</span>
                  )}
                </label>
                {errors.api && (
                  <p className="form-error" role="alert">{errors.api}</p>
                )}
                <button className="button primary" type="submit" disabled={isBusy}>
                  {buttonLabel}
                </button>
                <small>{t.tickets.note}</small>
              </>
            )}
          </form>
          <span className="ticket-stub">
            CTN
            <br />
            ALL
            <br />
            STARS
          </span>
        </div>
      </Reveal>
    </section>
  );
}
