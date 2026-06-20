export default function ContactForm() {
  return (
    <form>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" type="text" />
      <button type="submit">Send</button>
    </form>
  )
}
