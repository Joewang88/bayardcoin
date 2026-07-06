window.bayardSupabase = window.supabase.createClient(
  window.CONFIG.SUPABASE_URL,
  window.CONFIG.SUPABASE_KEY
);

async function getProducts(category = null) {
  let query = window.bayardSupabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase Error:", error);
    return [];
  }

  return data || [];
}

async function getProduct(id) {
  const { data, error } = await window.bayardSupabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase Error:", error);
    return null;
  }

  return data;
}
