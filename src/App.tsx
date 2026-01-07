import { useState, useEffect } from "react";
import { ContactsService } from "./generated/services/ContactsService";

// Define the options interface locally
interface IGetAllOptions {
  maxPageSize?: number;
  select?: string[];
  filter?: string;
  orderBy?: string[];
  top?: number;
  skip?: number;
  skipToken?: string;
}

export function App() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContacts() {
      try {
        setLoading(true);
        
        // Define options to get top 10 accounts
        const options: IGetAllOptions = {
          select: ['firstname', 'lastname', 'emailaddress1', 'mobilephone','jobtitle'],
          orderBy: ['createdon desc'],
          top: 10
        };
        
        // Retrieve accounts using the generated ContactsService
        const result = await ContactsService.getAll(options);
        
        if (result.data) {
          const contacts = result.data;
          console.log(`Retrieved ${contacts.length} contacts`);
          setContacts(contacts);
          setError(null);
        }
        
      } catch (err: any) {
        console.error('Failed to retrieve contacts:', err);
        setError(err.message || 'Failed to retrieve contacts');
      } finally {
        setLoading(false);
      }
    }
    
    fetchContacts();
  }, []);

  return (
    <div style={{ padding: "20px", color: "#fde7e9",fontFamily: "Segoe UI, sans-serif" }}>
      <h1>Top 10 Contacts from Dataverse</h1>
      
      {loading && (
        <div style={{ color: "#0078d4" }}>
          <p>Loading contacts...</p>
        </div>
      )}
      
      {error && (
        <div style={{ 
          color: "#a80000", 
          padding: "10px", 
          backgroundColor: "#fde7e9",
          borderRadius: "4px",
          marginBottom: "20px"
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {!loading && !error && (
        <div>
          <p style={{ color: "#0078d4", fontSize: "16px" }}>
            <strong>Total contacts retrieved:</strong> {contacts.length}
          </p>
          
          {contacts.length === 0 ? (
            <p style={{ color: "#605e5c" }}>No contacts found in Dataverse.</p>
          ) : (
            <div style={{ marginTop: "20px" }}>
              {contacts.map((contact, index) => (
                <div 
                  key={contact.contactid || index}
                  style={{
                    padding: "15px",
                    marginBottom: "15px",
                    border: "1px solid #edebe9",
                    borderRadius: "4px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}
                >
                  <h3 style={{ 
                    margin: "0 0 10px 0", 
                    color: "#323130",
                    fontSize: "18px"
                  }}>
                    {contact.firstname } {contact.lastname }
                  </h3>
                  
                  <div style={{ color: "#605e5c" }}>                    
                     {contact.jobtitle && (
                      <div style={{ marginBottom: "5px" }}>
                        <strong>Job Title:</strong> {contact.jobtitle}
                      </div>
                    )}
                   
                    
                    {contact.mobilephone && (
                      <div style={{ marginBottom: "5px" }}>
                        <strong>Phone:</strong> {contact.mobilephone}
                      </div>
                    )}
                    
                    {contact.emailaddress1 && (
                      <div>
                        <strong>Email:</strong> {contact.emailaddress1}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
//the app is perfectly fine