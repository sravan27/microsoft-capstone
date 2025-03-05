import streamlit as st
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline
#import torch

# -----------------------------------------------
# STEP 1: Load your fine-tuned DeBERTa model
# -----------------------------------------------
# Replace 'your-finetuned-deberta-model' with your model repository or local path.
# For example, if you fine-tuned a model and pushed it to Hugging Face Hub:
# model_name = "your-username/your-finetuned-deberta-model"
# In this demo, we'll simulate predictions if you do not have a model ready.

model_name = "microsoft/deberta-base"  # change to your fine-tuned model if available

try:
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)
    
    # Define a pipeline; assume that the model is set up to produce a single logit that we can map.
    # For a multi-task approach, you might instead have a custom head that outputs three scores.
    analyzer = pipeline("text-classification", model=model, tokenizer=tokenizer, return_all_scores=True)
    
    model_available = True
except Exception as e:
    st.error("Error loading the model. Falling back to dummy predictions.")
    model_available = False

# -----------------------------------------------
# STEP 2: Define a function to simulate or compute scores
# -----------------------------------------------
def predict_scores(article_text):
    """
    Predicts three scores (Political Influence, Rhetoric Intensity, Information Depth)
    from the given article text.
    
    In a production system, this function would use your fine-tuned model.
    For demonstration, we either use the model's output or simulate dummy scores.
    """
    if model_available and len(article_text.strip()) > 0:
        # For demonstration, we'll use the analyzer output on the text.
        # Note: In a true multi-task setting, your model should return three separate scores.
        # Here we assume that our model outputs a single score that we then perturb into three metrics.
        results = analyzer(article_text)
        # results is a list of label-score dictionaries.
        # For simplicity, we average the scores for our dummy example.
        # (In your fine-tuned model, you would extract each head's output.)
        avg_score = np.mean([entry['score'] for entry in results[0]])
        score_base = int(avg_score * 100)
        
        # Simulate slight variations for each metric.
        scores = {
            "political": min(100, max(0, score_base + np.random.randint(-5, 5))),
            "rhetoric": min(100, max(0, score_base + np.random.randint(-10, 10))),
            "depth":    min(100, max(0, score_base + np.random.randint(-15, 15)))
        }
    else:
        # Dummy predictions: random scores for demonstration
        scores = {
            "political": np.random.randint(0, 101),
            "rhetoric": np.random.randint(0, 101),
            "depth": np.random.randint(0, 101)
        }
    return scores

# -----------------------------------------------
# STEP 3: Create a function to generate a ring (doughnut) chart
# -----------------------------------------------
def create_ring_chart(score, label):
    # Create a small figure with transparent backgrounds.
    fig, ax = plt.subplots(figsize=(1, 1), subplot_kw={'aspect': 'equal'})
    fig.patch.set_facecolor('none')
    ax.set_facecolor('none')
    
    # Set up the ring parameters.
    outer_radius = 1.0
    width = 0.3  # Ring thickness
    inner_radius = outer_radius - width
    
    # Calculate the angle for the filled portion.
    # We start at 90 degrees (top) and move clockwise.
    theta_start = 90
    theta_end = 90 - (score / 100) * 360

    # Choose color palette based on the metric label.
    palettes = {
        "Political Influence": "#1f77b4",  # Blue
        "Rhetoric Intensity": "#ff7f0e",   # Orange
        "Information Depth": "#2ca02c"     # Green
    }
    fill_color = palettes.get(label, "#1f77b4")
    
    # Draw the filled wedge (ring segment) for the score.
    wedge = patches.Wedge(center=(0, 0), r=outer_radius,
                          theta1=theta_end, theta2=theta_start,
                          width=width, facecolor=fill_color, edgecolor='none')
    ax.add_patch(wedge)
    
    # The empty space is simply not drawn, so it remains transparent.
    
    # Place white text in the center with the score.
    ax.text(0, 0, f"{score}%", ha='center', va='center',
            fontsize=6, fontweight='bold', color='white')
    
    # Set the title (also in white).
    ax.set_title(label, fontsize=6, color='white')
    
    # Remove axes for a clean look.
    ax.set_xlim(-1.1, 1.1)
    ax.set_ylim(-1.1, 1.1)
    ax.axis('off')
    plt.tight_layout()
    
    return fig


# -----------------------------------------------
# STEP 4: Build the Streamlit UI
# -----------------------------------------------
st.title("News Bias Analysis Tool")
st.write("Load a news article and analyze its bias metrics based on Political Influence, Rhetoric Intensity, and Information Depth.")

# Input: Text area for pasting article content
article_text = st.text_area("Paste your article text here:", height=300)

if st.button("Process Article"):
    if article_text.strip() == "":
        st.error("Please paste an article text for analysis.")
    else:
        # Show a spinner while processing
        with st.spinner("Analyzing article..."):
            scores = predict_scores(article_text)
        st.success("Analysis complete!")
        
        # Display the results on the main page
        st.write("### Analysis Results")
        st.write(f"**Political Influence Level:** {scores['political']}%")
        st.write(f"**Rhetoric Intensity Scale:** {scores['rhetoric']}%")
        st.write(f"**Information Depth Score:** {scores['depth']}%")
        
        # Render ring charts on the sidebar for visual emphasis
        st.sidebar.header("Metric Visualizations")
        #st.sidebar.subheader("Political Influence")
        st.sidebar.pyplot(create_ring_chart(scores.get("political", 0), "Political Influence"))
        #st.sidebar.subheader("Rhetoric Intensity")
        st.sidebar.pyplot(create_ring_chart(scores.get("rhetoric", 0), "Rhetoric Intensity"))
        #st.sidebar.subheader("Information Depth")
        st.sidebar.pyplot(create_ring_chart(scores.get("depth", 0), "Information Depth"))
