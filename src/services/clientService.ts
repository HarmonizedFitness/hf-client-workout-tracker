
import { supabase } from '@/integrations/supabase/client';
import { SupabaseClient, NewClientData, ClientUpdateData } from '@/types/client';

export const clientService = {
  async fetchClients(trainerId: string): Promise<SupabaseClient[]> {
    console.log('Fetching clients for trainer:', trainerId);
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('trainer_id', trainerId)
      .order('created_at', { ascending: false });

    console.log('Supabase clients query result:', { data, error });

    if (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
    
    console.log('Successfully fetched clients:', data);
    return data as SupabaseClient[];
  },

  async addClient(newClient: NewClientData, trainerId: string): Promise<SupabaseClient> {
    console.log('🚀 Starting addClient with data:', newClient);
    console.log('🔑 Trainer ID:', trainerId);
    
    // Get current auth user
    const { data: authUser, error: authError } = await supabase.auth.getUser();
    console.log('🔐 Auth user:', authUser?.user?.id, 'Auth error:', authError);
    
    if (!authUser?.user) {
      const errorMsg = 'No authenticated user found';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }
    
    const clientData = {
      ...newClient,
      trainer_id: trainerId,
    };
    
    console.log('📦 Final client data for insertion:', clientData);
    console.log('📊 Data types:', {
      name: typeof clientData.name,
      trainer_id: typeof clientData.trainer_id,
      training_days_per_week: typeof clientData.training_days_per_week,
      cost_per_session: typeof clientData.cost_per_session,
    });
    
    // Test if we can query the clients table first
    console.log('🧪 Testing clients table access...');
    const { data: testData, error: testError } = await supabase
      .from('clients')
      .select('id')
      .eq('trainer_id', trainerId)
      .limit(1);
    
    console.log('🧪 Test query result:', { testData, testError });
    
    console.log('💾 Attempting to insert client into Supabase...');
    
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();

    console.log('💾 Supabase insert result:', { data, error });
    console.log('💾 Insert error details:', error?.message, error?.details, error?.hint, error?.code);

    if (error) {
      console.error('🔥 Supabase insert error:', error);
      // More detailed error information
      if (error.code === 'PGRST301') {
        console.error('🔥 Row Level Security policy violation');
      }
      throw new Error(`Database error: ${error.message} (Code: ${error.code})`);
    }
    
    if (!data) {
      const errorMsg = 'No data returned from insert operation';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }
    
    console.log('✅ Successfully created client:', data);
    return data;
  },

  async updateClient({ id, updates }: ClientUpdateData): Promise<SupabaseClient> {
    console.log('🔄 Starting updateClient for ID:', id);
    console.log('📝 Updates to apply:', updates);
    
    // Get current auth user for debugging
    const { data: authUser, error: authError } = await supabase.auth.getUser();
    console.log('🔐 Current auth user:', authUser?.user?.id);
    
    if (!authUser?.user) {
      const errorMsg = 'No authenticated user found';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }

    // First, let's check if we can read the current client
    console.log('🔍 Checking current client data...');
    const { data: currentClient, error: fetchError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    console.log('🔍 Current client data:', currentClient);
    console.log('🔍 Fetch error:', fetchError);
    
    if (fetchError) {
      console.error('❌ Cannot fetch current client:', fetchError);
      throw new Error(`Cannot access client: ${fetchError.message}`);
    }
    
    if (!currentClient) {
      throw new Error('Client not found or you do not have permission to edit this client');
    }
    
    console.log('💾 Attempting to update client...');
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    console.log('💾 Update result:', { data, error });
    
    if (error) {
      console.error('🔥 Client update error:', error);
      console.error('🔥 Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // Provide more specific error messages
      if (error.code === 'PGRST301') {
        throw new Error('Permission denied: You can only edit your own clients');
      } else if (error.code === '23505') {
        throw new Error('A client with this information already exists');
      } else if (error.code === '23514') {
        throw new Error('Invalid data provided');
      } else {
        throw new Error(`Update failed: ${error.message}`);
      }
    }
    
    if (!data) {
      const errorMsg = 'No data returned from update operation';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }
    
    console.log('✅ Successfully updated client:', data);
    return data;
  },

  async archiveClient(clientId: string): Promise<SupabaseClient> {
    console.log('📦 Archiving client:', clientId);
    
    const { data, error } = await supabase
      .from('clients')
      .update({ 
        is_active: false, 
        date_archived: new Date().toISOString().split('T')[0] 
      })
      .eq('id', clientId)
      .select()
      .single();

    if (error) {
      console.error('Client archive error:', error);
      throw error;
    }
    return data;
  }
};
