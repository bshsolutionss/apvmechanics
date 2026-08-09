"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Heart, Minus, Plus, ShoppingCart, Star, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { useCommerce } from "@/components/commerce/commerce-provider";
import { products } from "@/lib/site-data";

export function ProductDetailsContent() {
  const searchParams = useSearchParams();
  const product = products.find((item) => item.id === searchParams.get("product")) ?? products[0];
  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleWishlist, wishlist } = useCommerce();

  return (
    <section className="section detail-section">
      <div className="container product-detail-grid">
        <div className="product-detail-image"><Image src={product.image} alt={product.name} fill priority sizes="600px" /></div>
        <div className="product-detail-copy">
          <div className="stars">{[1, 2, 3, 4, 5].map((item) => <Star key={item} fill="currentColor" />)}</div>
          <h2>{product.name}</h2>
          <p className="product-detail-price">${product.price.toFixed(2)} <del>${product.oldPrice.toFixed(2)}</del></p>
          <p>Workshop-grade automotive equipment selected for dependable performance, accurate work and long service life.</p>
          <ul>
            <li>Professional-grade build quality</li>
            <li>Tested for automotive workshop use</li>
            <li>Fast dispatch and secure packaging</li>
          </ul>
          <div className="quantity-row">
            <div className="quantity-control">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((current) => Math.max(1, current - 1))}><Minus /></button>
              <span>{quantity}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((current) => current + 1)}><Plus /></button>
            </div>
            <button className="primary-action" type="button" onClick={() => addToCart(product.id, quantity)}><ShoppingCart /> Add to Cart</button>
            <button className={`round-action ${wishlist.includes(product.id) ? "active" : ""}`} type="button" onClick={() => toggleWishlist(product.id)} aria-label="Toggle wishlist"><Heart fill={wishlist.includes(product.id) ? "currentColor" : "none"} /></button>
          </div>
          <dl><div><dt>SKU:</dt><dd>AM-{product.id.toUpperCase()}</dd></div><div><dt>Category:</dt><dd>Automotive Tools</dd></div><div><dt>Availability:</dt><dd>In stock</dd></div></dl>
        </div>
      </div>
    </section>
  );
}

export function CartContent() {
  const { cart, cartTotal, productFor, removeFromCart, setQuantity } = useCommerce();
  return (
    <section className="section commerce-page">
      <div className="container">
        {cart.length === 0 ? (
          <EmptyCommerce icon={<ShoppingCart />} title="Your cart is empty" text="Add workshop essentials and automotive products to continue." />
        ) : (
          <div className="cart-layout">
            <div className="cart-table">
              <div className="cart-table__head"><span>Product</span><span>Price</span><span>Quantity</span><span>Subtotal</span><span /></div>
              {cart.map((line) => {
                const product = productFor(line.id);
                if (!product) return null;
                return <article key={line.id}>
                  <Link href={`/product-details?product=${product.id}`}><Image src={product.image} alt={product.name} width={92} height={92} /><b>{product.name}</b></Link>
                  <span>${product.price.toFixed(2)}</span>
                  <div className="quantity-control">
                    <button type="button" onClick={() => setQuantity(line.id, line.quantity - 1)} aria-label="Decrease quantity"><Minus /></button>
                    <span>{line.quantity}</span>
                    <button type="button" onClick={() => setQuantity(line.id, line.quantity + 1)} aria-label="Increase quantity"><Plus /></button>
                  </div>
                  <strong>${(product.price * line.quantity).toFixed(2)}</strong>
                  <button type="button" onClick={() => removeFromCart(line.id)} aria-label={`Remove ${product.name}`}><Trash2 /></button>
                </article>;
              })}
            </div>
            <aside className="order-summary">
              <h3>Cart Totals</h3>
              <p><span>Subtotal</span><b>${cartTotal.toFixed(2)}</b></p>
              <p><span>Shipping</span><b>Free</b></p>
              <p className="order-total"><span>Total</span><b>${cartTotal.toFixed(2)}</b></p>
              <Link className="primary-action" href="/checkout">Proceed to Checkout</Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

export function WishlistContent() {
  const { wishlist, toggleWishlist, addToCart } = useCommerce();
  const savedProducts = products.filter((product) => wishlist.includes(product.id));
  return (
    <section className="section commerce-page">
      <div className="container">
        {savedProducts.length === 0 ? (
          <EmptyCommerce icon={<Heart />} title="Your wishlist is empty" text="Save products here so you can return to them later." />
        ) : (
          <div className="wishlist-grid">
            {savedProducts.map((product) => <article key={product.id}>
              <Link href={`/product-details?product=${product.id}`}><div><Image src={product.image} alt={product.name} fill sizes="280px" /></div><h3>{product.name}</h3></Link>
              <p>${product.price.toFixed(2)}</p>
              <div><button className="primary-action" type="button" onClick={() => addToCart(product.id)}><ShoppingCart /> Add to Cart</button><button className="round-action" type="button" onClick={() => toggleWishlist(product.id)} aria-label={`Remove ${product.name}`}><Trash2 /></button></div>
            </article>)}
          </div>
        )}
      </div>
    </section>
  );
}

function EmptyCommerce({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="empty-commerce">{icon}<h2>{title}</h2><p>{text}</p><Link className="primary-action" href="/shop">Continue Shopping</Link></div>;
}

export function CheckoutContent() {
  const { cart, cartTotal, productFor, clearCart } = useCommerce();
  const [complete, setComplete] = useState(false);
  const orderLines = useMemo(() => cart.map((line) => ({ ...line, product: productFor(line.id) })).filter((line) => line.product), [cart, productFor]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = data.get("firstName")?.toString() || "Customer";
    const lastName = data.get("lastName")?.toString() || "";
    const email = data.get("email")?.toString() || "";
    const phone = data.get("phone")?.toString() || "N/A";
    const address = data.get("address")?.toString() || "";
    const city = data.get("city")?.toString() || "";
    const postcode = data.get("postcode")?.toString() || "";
    const notes = data.get("notes")?.toString() || "None";
    const reference = `APV-ORD-${Date.now().toString().slice(-6)}`;

    const itemsSummary = orderLines
      .map((l) => `${l.product?.name || "Item"} x${l.quantity} ($${((l.product?.price ?? 0) * l.quantity).toFixed(2)})`)
      .join(", ");

    const fullMessage = `ORDER REFERENCE: ${reference}\nITEMS: ${itemsSummary}\nTOTAL AMOUNT: $${cartTotal.toFixed(2)}\nSHIPPING ADDRESS: ${address}, ${city} ${postcode}\nNOTES: ${notes}`;

    // Send order via /api/contact for Admin notification & Customer Order Confirmation
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${firstName} ${lastName}`.trim(),
        email: email.trim(),
        phone: phone.trim(),
        service: `Product Order (${reference})`,
        message: fullMessage,
      }),
    }).catch(() => { });

    window.localStorage.setItem("automart-last-order", JSON.stringify({ reference, total: cartTotal, createdAt: new Date().toISOString() }));
    clearCart();
    setComplete(true);
  };
  if (complete) return <section className="section commerce-page"><div className="container"><div className="form-success"><CheckCircle2 /><h2>Order Received Successfully!</h2><p>Your order confirmation and details have been sent to your email address and logged in our system.</p><Link className="primary-action" href="/shop">Back to Products</Link></div></div></section>;
  return (
    <section className="section commerce-page">
      <div className="container checkout-layout">
        <form className="automart-form" onSubmit={submit}>
          <h2>Billing Details</h2>
          <div className="form-two"><label>First Name<input required name="firstName" /></label><label>Last Name<input required name="lastName" /></label></div>
          <label>Company Name <small>(optional)</small><input name="company" /></label>
          <label>Country / Region<select required defaultValue=""><option value="" disabled>Select country</option><option>Australia</option><option>Pakistan</option><option>United Kingdom</option><option>United States</option></select></label>
          <label>Street Address<input required name="address" placeholder="House number and street name" /></label>
          <div className="form-two"><label>Town / City<input required name="city" /></label><label>Postcode<input required name="postcode" /></label></div>
          <div className="form-two"><label>Phone<input required name="phone" type="tel" /></label><label>Email<input required name="email" type="email" /></label></div>
          <label>Order Notes<textarea name="notes" rows={4} placeholder="Notes about your order" /></label>
          <button className="primary-action" type="submit" disabled={cart.length === 0}>Place Order</button>
        </form>
        <aside className="order-summary">
          <h3>Your Order</h3>
          {orderLines.map((line) => <p key={line.id}><span>{line.product?.name} × {line.quantity}</span><b>${((line.product?.price ?? 0) * line.quantity).toFixed(2)}</b></p>)}
          {orderLines.length === 0 && <p>Your cart is currently empty.</p>}
          <p><span>Shipping</span><b>Free</b></p>
          <p className="order-total"><span>Total</span><b>${cartTotal.toFixed(2)}</b></p>
          <small>This is a frontend demonstration. No payment details are collected or transmitted.</small>
        </aside>
      </div>
    </section>
  );
}

export function AuthContent({ mode }: { mode: "login" | "signup" }) {
  const [complete, setComplete] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    window.localStorage.setItem("automart-user", JSON.stringify({ name: data.get("name"), email: data.get("email") }));
    setComplete(true);
  };
  return (
    <section className="section auth-section">
      <div className="auth-card">
        {complete ? <div className="form-success"><CheckCircle2 /><h2>{mode === "login" ? "Signed in locally" : "Account created locally"}</h2><p>Your demo profile is stored only in this browser.</p><Link className="primary-action" href="/">Return Home</Link></div> :
          <form className="automart-form" onSubmit={submit}>
            <span className="auth-card__eyebrow">WELCOME TO AUTOMART</span>
            <h2>{mode === "login" ? "Login To Your Account" : "Create Your Account"}</h2>
            {mode === "signup" && <label>Full Name<input required name="name" autoComplete="name" /></label>}
            <label>Email Address<input required name="email" type="email" autoComplete="email" /></label>
            <label>Password<input required name="password" type="password" minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
            <label className="check-label"><input type="checkbox" required={mode === "signup"} /><span>{mode === "signup" ? "I agree to the terms and privacy policy." : "Remember me on this device."}</span></label>
            <button className="primary-action" type="submit">{mode === "login" ? "Login" : "Sign Up"}</button>
            <p>{mode === "login" ? "New to Automart?" : "Already have an account?"} <Link href={mode === "login" ? "/sign-up" : "/login"}>{mode === "login" ? "Create account" : "Login"}</Link></p>
          </form>}
      </div>
    </section>
  );
}
