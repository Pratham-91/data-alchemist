"use client";

import React, { useState, useEffect } from "react";
import { BusinessRule } from "../../types/rules";

export default function RulesPage() {
  const [rules, setRules] = useState<BusinessRule[]>([]);
  const [selectedRule, setSelectedRule] = useState<BusinessRule | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState<Partial<Omit<BusinessRule, 'conditions' | 'actions'> & { conditions: string; actions: string }>>({});
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    const res = await fetch("/api/rules");
    const data = await res.json();
    setRules(data);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.type || !form.status || !form.priority) return;
    const newRule = {
      ...form,
      conditions: typeof form.conditions === 'string' && form.conditions.length > 0 ? form.conditions.split('\n') : [],
      actions: typeof form.actions === 'string' && form.actions.length > 0 ? form.actions.split('\n') : [],
    };
    await fetch("/api/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRule),
    });
    setShowCreateForm(false);
    setForm({});
    fetchRules();
  };

  const handleEdit = (rule: BusinessRule) => {
    setSelectedRule(rule);
    setForm({
      ...rule,
      conditions: Array.isArray(rule.conditions) ? rule.conditions.join('\n') : '',
      actions: Array.isArray(rule.actions) ? rule.actions.join('\n') : '',
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRule) return;
    const updatedRule = {
      ...selectedRule,
      ...form,
      conditions: typeof form.conditions === 'string' && form.conditions.length > 0 ? form.conditions.split('\n') : [],
      actions: typeof form.actions === 'string' && form.actions.length > 0 ? form.actions.split('\n') : [],
    };
    await fetch("/api/rules", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRule),
    });
    setSelectedRule(null);
    setForm({});
    fetchRules();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/rules", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSelectedRule(null);
    fetchRules();
  };

  const getTypeColor = (type: BusinessRule['type']) => {
    switch (type) {
      case 'validation': return 'bg-blue-100 text-blue-800';
      case 'transformation': return 'bg-green-100 text-green-800';
      case 'constraint': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: BusinessRule['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: BusinessRule['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAIGenerate = async () => {
    setAiLoading(true);
    setAiError("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (data && data.rule) {
        setForm({
          name: data.rule.name || "",
          description: data.rule.description || "",
          type: data.rule.type || "validation",
          status: data.rule.status || "active",
          priority: data.rule.priority || "medium",
          conditions: (data.rule.conditions || []).join("\n"),
          actions: (data.rule.actions || []).join("\n"),
        });
        setShowCreateForm(true);
      } else {
        setAiError(data.message || "AI could not generate a rule.");
      }
    } catch (e) {
      setAiError("Failed to contact AI service.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium">
          <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
          Business Rules
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          Define Business Rules
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Create and manage business rules to ensure data quality and enforce business logic.
        </p>
      </div>

      {/* Rules Summary */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rules</p>
              <p className="text-2xl font-bold text-gray-900">{rules.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {rules.filter(r => r.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-yellow-600">
                {rules.filter(r => r.status === 'draft').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-xl">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">
                {rules.filter(r => r.priority === 'high').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 text-xl">⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="bg-white rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Business Rules</h2>
            <button 
              onClick={() => { setShowCreateForm(true); setForm({}); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Create Rule
            </button>
          </div>

          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(rule.type)}`}>
                        {rule.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rule.status)}`}>
                        {rule.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rule.priority)}`}>
                        {rule.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{rule.description}</p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Conditions:</h4>
                        <ul className="space-y-1">
                          {rule.conditions.map((condition, index) => (
                            <li key={index} className="text-gray-600">• {condition}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Actions:</h4>
                        <ul className="space-y-1">
                          {rule.actions.map((action, index) => (
                            <li key={index} className="text-gray-600">• {action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => handleEdit(rule)}
                    >
                      <span className="text-lg">✏️</span>
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      onClick={() => handleDelete(rule.id)}
                    >
                      <span className="text-lg">🗑️</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Rule Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg space-y-4"
            onSubmit={handleCreate}
          >
            <h2 className="text-xl font-bold mb-2">Create Rule</h2>
            <input name="name" value={form.name || ""} onChange={handleFormChange} placeholder="Name" className="w-full border p-2 rounded" required />
            <textarea name="description" value={form.description || ""} onChange={handleFormChange} placeholder="Description" className="w-full border p-2 rounded" />
            <select name="type" value={form.type || ""} onChange={handleFormChange} className="w-full border p-2 rounded" required>
              <option value="">Type</option>
              <option value="validation">Validation</option>
              <option value="transformation">Transformation</option>
              <option value="constraint">Constraint</option>
            </select>
            <select name="status" value={form.status || ""} onChange={handleFormChange} className="w-full border p-2 rounded" required>
              <option value="">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
            <select name="priority" value={form.priority || ""} onChange={handleFormChange} className="w-full border p-2 rounded" required>
              <option value="">Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <textarea name="conditions" value={form.conditions || ""} onChange={handleFormChange} placeholder="Conditions (one per line)" className="w-full border p-2 rounded" />
            <textarea name="actions" value={form.actions || ""} onChange={handleFormChange} placeholder="Actions (one per line)" className="w-full border p-2 rounded" />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Create</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Rule Form */}
      {selectedRule && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg space-y-4"
            onSubmit={handleSaveEdit}
          >
            <h2 className="text-xl font-bold mb-2">Edit Rule</h2>
            <input name="name" value={form.name || ""} onChange={handleFormChange} placeholder="Name" className="w-full border p-2 rounded" required />
            <textarea name="description" value={form.description || ""} onChange={handleFormChange} placeholder="Description" className="w-full border p-2 rounded" />
            <select name="type" value={form.type || ""} onChange={handleFormChange} className="w-full border p-2 rounded" required>
              <option value="">Type</option>
              <option value="validation">Validation</option>
              <option value="transformation">Transformation</option>
              <option value="constraint">Constraint</option>
            </select>
            <select name="status" value={form.status || ""} onChange={handleFormChange} className="w-full border p-2 rounded" required>
              <option value="">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
            <select name="priority" value={form.priority || ""} onChange={handleFormChange} className="w-full border p-2 rounded" required>
              <option value="">Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <textarea name="conditions" value={form.conditions || ""} onChange={handleFormChange} placeholder="Conditions (one per line)" className="w-full border p-2 rounded" />
            <textarea name="actions" value={form.actions || ""} onChange={handleFormChange} placeholder="Actions (one per line)" className="w-full border p-2 rounded" />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setSelectedRule(null)} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Rule Templates */}
      <div className="bg-white rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Rule Templates</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors duration-200 cursor-pointer">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="font-semibold text-gray-900 mb-2">Data Validation</h3>
              <p className="text-gray-600 text-sm mb-4">Create rules to validate data formats, ranges, and relationships.</p>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">Use Template →</button>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-xl hover:border-green-300 transition-colors duration-200 cursor-pointer">
              <div className="text-3xl mb-4">🔄</div>
              <h3 className="font-semibold text-gray-900 mb-2">Data Transformation</h3>
              <p className="text-gray-600 text-sm mb-4">Transform data formats, calculate derived fields, and clean data.</p>
              <button className="text-green-600 text-sm font-medium hover:text-green-700">Use Template →</button>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors duration-200 cursor-pointer">
              <div className="text-3xl mb-4">⚖️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Business Constraints</h3>
              <p className="text-gray-600 text-sm mb-4">Enforce business logic, relationships, and operational rules.</p>
              <button className="text-purple-600 text-sm font-medium hover:text-purple-700">Use Template →</button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Rule Assistant */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">🤖</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">AI Rule Assistant</h2>
              <p className="text-gray-600">Let AI help you create business rules from natural language</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="Describe your business rule in plain English... (e.g., 'Ensure all client priority levels are between 1 and 5')"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
            {aiError && <div className="text-red-600 text-sm mt-2">{aiError}</div>}
            <div className="flex justify-end">
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                onClick={handleAIGenerate}
                disabled={aiLoading || !aiPrompt.trim()}
                type="button"
              >
                {aiLoading ? "Generating..." : "Generate Rule"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}