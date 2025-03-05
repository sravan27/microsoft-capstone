import streamlit as st
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import json
from math import exp
from openai import Client

# Set your OpenAI API key (it's recommended to use an environment variable)

API_KEY = ""

client = Client(api_key=API_KEY)

def sigmoid(x):
    return 1 / (1 + exp(-x))

# -----------------------------------------------
# STEP 1: Define a function to call the OpenAI API and compute composite scores
# -----------------------------------------------
def predict_scores(article_text):
    """
    Uses the OpenAI API to analyze the provided article and output a detailed JSON breakdown with:
      - political_raw: base probability (0-1) for political influence.
      - controversial_factor: an additional factor (0-1) based on controversial language.
      - rhetoric_raw: base probability (0-1) for rhetoric intensity.
      - emotional_factor: an additional factor (0-1) for emotional charge.
      - depth_raw: base probability (0-1) for information depth.
      - context_factor: a factor (0-1) representing the richness of context.
      
    We then compute:
      PIL = (0.6*political_raw + 0.4*controversial_factor - 0.1)*100
      RIS = (0.7*rhetoric_raw + 0.3*emotional_factor - 0.05)*100
      IDS = (0.5*depth_raw + 0.5*context_factor)*100
      
    The API is expected to output the JSON in the following format:
    {
      "political_raw": <value>,
      "controversial_factor": <value>,
      "rhetoric_raw": <value>,
      "emotional_factor": <value>,
      "depth_raw": <value>,
      "context_factor": <value>
    }
    """
    # Construct the prompt with detailed instructions:
    system_message = (
        "You are an expert text analyzer. Analyze the provided article and compute intermediate factors as follows:\n"
        "1. 'political_raw': a base value between 0 and 1 indicating political motivation.\n"
        "2. 'controversial_factor': a value between 0 and 1 reflecting the presence of controversial language.\n"
        "3. 'rhetoric_raw': a base value between 0 and 1 indicating persuasive language intensity.\n"
        "4. 'emotional_factor': a value between 0 and 1 indicating emotional charge.\n"
        "5. 'depth_raw': a base value between 0 and 1 representing the depth of information.\n"
        "6. 'context_factor': a value between 0 and 1 reflecting the richness of context and detail.\n\n"
        "Output your analysis as a JSON dictionary with the keys exactly as above."
    )
    user_message = f"Article:\n\"\"\"{article_text}\"\"\""
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # use a valid model
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            max_tokens=200,
            temperature=0.2
        )
        output_text = response.choices[0].message.content.strip()
        print("Raw API response text:", output_text)
        
        # Clean markdown formatting if present
        if output_text.startswith("```"):
            lines = output_text.splitlines()
            lines = [line for line in lines if not line.strip().startswith("```")]
            output_text = "\n".join(lines).strip()
            print("Cleaned API response text:", output_text)
        
        # Parse the JSON output
        analysis = json.loads(output_text)
        
        # Extract intermediate factors (defaulting to 0 if missing)
        political_raw       = float(analysis.get("political_raw", 0))
        controversial_factor= float(analysis.get("controversial_factor", 0))
        rhetoric_raw        = float(analysis.get("rhetoric_raw", 0))
        emotional_factor    = float(analysis.get("emotional_factor", 0))
        depth_raw           = float(analysis.get("depth_raw", 0))
        context_factor      = float(analysis.get("context_factor", 0))
        
        # Compute final metrics using the conceptual formulas:
        PIL = (0.6 * political_raw + 0.4 * controversial_factor - 0.1) * 100
        RIS = (0.7 * rhetoric_raw + 0.3 * emotional_factor - 0.05) * 100
        IDS = (0.5 * depth_raw + 0.5 * context_factor) * 100
        
        # Print debug info
        print(f"Intermediate Factors:")
        print(f"  political_raw: {political_raw}")
        print(f"  controversial_factor: {controversial_factor}")
        print(f"  rhetoric_raw: {rhetoric_raw}")
        print(f"  emotional_factor: {emotional_factor}")
        print(f"  depth_raw: {depth_raw}")
        print(f"  context_factor: {context_factor}")
        print(f"Computed Scores:")
        print(f"  Political Influence Level: {PIL:.2f}%")
        print(f"  Rhetoric Intensity Scale: {RIS:.2f}%")
        print(f"  Information Depth Score: {IDS:.2f}%")
        
        return {
            "political": int(round(PIL)),
            "rhetoric": int(round(RIS)),
            "depth": int(round(IDS))
        }
    except Exception as e:
        st.error(f"Error processing API response: {e}")
        # Fallback: return dummy scores
        return {
            "political": np.random.randint(0, 101),
            "rhetoric": np.random.randint(0, 101),
            "depth": np.random.randint(0, 101)
        }

# -----------------------------------------------
# STEP 2: Create a function to generate a ring (doughnut) chart
# -----------------------------------------------
def create_ring_chart(score, label):
    fig, ax = plt.subplots(figsize=(1, 1), subplot_kw={'aspect': 'equal'})
    fig.patch.set_facecolor('none')
    ax.set_facecolor('none')
    
    outer_radius = 1.0
    width = 0.3  # Ring thickness
    theta_start = 90
    theta_end = 90 - (score / 100) * 360

    palettes = {
        "Political Influence": "#1f77b4",
        "Rhetoric Intensity": "#ff7f0e",
        "Information Depth": "#2ca02c"
    }
    fill_color = palettes.get(label, "#1f77b4")
    
    wedge = patches.Wedge(center=(0, 0), r=outer_radius,
                          theta1=theta_end, theta2=theta_start,
                          width=width, facecolor=fill_color, edgecolor='none')
    ax.add_patch(wedge)
    ax.text(0, 0, f"{score}%", ha='center', va='center',
            fontsize=6, fontweight='bold', color='white')
    ax.set_title(label, fontsize=6, color='white')
    ax.set_xlim(-1.1, 1.1)
    ax.set_ylim(-1.1, 1.1)
    ax.axis('off')
    plt.tight_layout()
    return fig

# -----------------------------------------------
# STEP 3: Build the Streamlit UI
# -----------------------------------------------
st.title("News Bias Analysis Tool")
st.write("Load a news article and analyze its bias metrics based on Political Influence, Rhetoric Intensity, and Information Depth.")

article_text = st.text_area("Paste your article text here:", height=300)

if st.button("Process Article"):
    if article_text.strip() == "":
        st.error("Please paste an article text for analysis.")
    else:
        with st.spinner("Analyzing article..."):
            scores = predict_scores(article_text)
        st.success("Analysis complete!")
        
        st.write("### Analysis Results")
        st.write(f"**Political Influence Level:** {scores['political']}%")
        st.write(f"**Rhetoric Intensity Scale:** {scores['rhetoric']}%")
        st.write(f"**Information Depth Score:** {scores['depth']}%")
        
        st.sidebar.header("Metric Visualizations")
        st.sidebar.pyplot(create_ring_chart(scores.get("political", 0), "Political Influence"))
        st.sidebar.pyplot(create_ring_chart(scores.get("rhetoric", 0), "Rhetoric Intensity"))
        st.sidebar.pyplot(create_ring_chart(scores.get("depth", 0), "Information Depth"))
